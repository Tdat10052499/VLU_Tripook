#!/usr/bin/env python3
from pymongo import MongoClient

c = MongoClient('mongodb+srv://dat:Tdat.100524@tripook-cluster.ht8st5x.mongodb.net/tripook')
p = c.tripook.users.find_one({'email': 'final.test.provider@example.com'})

print('\n✅ Provider found!')
print('\nKey fields:')
print(f'  accountStatus: {p.get("accountStatus")}')
print(f'  fullName: {p.get("fullName")}')
print(f'  isEmailVerified: {p.get("isEmailVerified")}')
print(f'  companyName: {p.get("companyName")}')
print(f'  businessType: {p.get("businessType")}')
print(f'  businessAddress: {p.get("businessAddress")}')
print(f'  createdAt: {p.get("createdAt")}')
print(f'  role: {p.get("role")}')
print(f'  status: {p.get("status")}')

c.close()
