from datetime import datetime
from bson import ObjectId
from app.utils.database import get_db

class Payment:
    def __init__(self, booking_id, user_id, amount, currency="USD"):
        self.booking_id = ObjectId(booking_id) if isinstance(booking_id, str) else booking_id
        self.user_id = ObjectId(user_id) if isinstance(user_id, str) else user_id
        self.amount = float(amount)
        self.currency = currency
        
        # Payment method information
        self.payment_method = None  # 'credit_card', 'paypal', 'bank_transfer', 'wallet'
        self.payment_provider = None  # 'stripe', 'paypal', 'vnpay', etc.
        self.payment_reference = None  # External payment ID
        
        # Transaction details
        self.transaction_id = None
        self.transaction_reference = None
        
        # Status and processing
        self.status = "pending"  # 'pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'
        self.payment_intent_id = None  # For payment processors like Stripe
        
        # Breakdown
        self.fee_amount = 0.0  # Platform fee
        self.tax_amount = 0.0  # Tax amount
        self.net_amount = amount  # Amount after fees
        
        # Refund information
        self.refund_amount = 0.0
        self.refund_reason = None
        self.refunded_at = None
        
        # Card/Payment method details (encrypted/tokenized)
        self.payment_details = {
            "last4": None,
            "brand": None,
            "exp_month": None,
            "exp_year": None
        }
        
        # Processing information
        self.processor_response = {}
        self.failure_reason = None
        self.retry_count = 0
        
        # Timestamps
        self.created_at = datetime.utcnow()
        self.processed_at = None
        self.completed_at = None
        self.updated_at = datetime.utcnow()

    def to_dict(self):
        """Convert payment to dictionary for MongoDB storage"""
        return {
            'booking_id': self.booking_id,
            'user_id': self.user_id,
            'amount': self.amount,
            'currency': self.currency,
            'payment_method': self.payment_method,
            'payment_provider': self.payment_provider,
            'payment_reference': self.payment_reference,
            'transaction_id': self.transaction_id,
            'transaction_reference': self.transaction_reference,
            'status': self.status,
            'payment_intent_id': self.payment_intent_id,
            'fee_amount': self.fee_amount,
            'tax_amount': self.tax_amount,
            'net_amount': self.net_amount,
            'refund_amount': self.refund_amount,
            'refund_reason': self.refund_reason,
            'refunded_at': self.refunded_at,
            'payment_details': self.payment_details,
            'processor_response': self.processor_response,
            'failure_reason': self.failure_reason,
            'retry_count': self.retry_count,
            'created_at': self.created_at,
            'processed_at': self.processed_at,
            'completed_at': self.completed_at,
            'updated_at': self.updated_at
        }

    @classmethod
    def from_dict(cls, data):
        """Create payment from dictionary"""
        payment = cls(
            booking_id=data['booking_id'],
            user_id=data['user_id'],
            amount=data['amount'],
            currency=data.get('currency', 'USD')
        )
        
        # Update all fields
        for key, value in data.items():
            if hasattr(payment, key):
                setattr(payment, key, value)
        
        return payment

    def save(self):
        """Save payment to database"""
        db = get_db()
        collection = db.payments
        
        self.updated_at = datetime.utcnow()
        
        if hasattr(self, '_id'):
            # Update existing payment
            result = collection.update_one(
                {'_id': self._id},
                {'$set': self.to_dict()}
            )
            return result.modified_count > 0
        else:
            # Create new payment
            result = collection.insert_one(self.to_dict())
            self._id = result.inserted_id
            return True

    @classmethod
    def find_by_id(cls, payment_id):
        """Find payment by ID"""
        db = get_db()
        collection = db.payments
        
        payment_data = collection.find_one({'_id': ObjectId(payment_id)})
        if payment_data:
            return cls.from_dict(payment_data)
        return None

    @classmethod
    def find_by_booking(cls, booking_id):
        """Find all payments for a booking"""
        db = get_db()
        collection = db.payments
        
        payments_data = collection.find({'booking_id': ObjectId(booking_id)}).sort('created_at', -1)
        return [cls.from_dict(data) for data in payments_data]

    @classmethod
    def find_by_user(cls, user_id):
        """Find all payments for a user"""
        db = get_db()
        collection = db.payments
        
        payments_data = collection.find({'user_id': ObjectId(user_id)}).sort('created_at', -1)
        return [cls.from_dict(data) for data in payments_data]

    @classmethod
    def find_by_status(cls, status):
        """Find payments by status"""
        db = get_db()
        collection = db.payments
        
        payments_data = collection.find({'status': status}).sort('created_at', -1)
        return [cls.from_dict(data) for data in payments_data]

    def mark_as_completed(self, transaction_id=None, processor_response=None):
        """Mark payment as completed"""
        self.status = "completed"
        self.completed_at = datetime.utcnow()
        if transaction_id:
            self.transaction_id = transaction_id
        if processor_response:
            self.processor_response = processor_response
        return self.save()

    def mark_as_failed(self, failure_reason=None, processor_response=None):
        """Mark payment as failed"""
        self.status = "failed"
        self.failure_reason = failure_reason
        if processor_response:
            self.processor_response = processor_response
        return self.save()

    def process_refund(self, refund_amount=None, reason=None):
        """Process refund"""
        refund_amount = refund_amount or self.amount
        self.refund_amount = refund_amount
        self.refund_reason = reason
        self.refunded_at = datetime.utcnow()
        
        if refund_amount >= self.amount:
            self.status = "refunded"
        
        return self.save()

    def can_be_refunded(self):
        """Check if payment can be refunded"""
        return self.status == "completed" and self.refund_amount < self.amount