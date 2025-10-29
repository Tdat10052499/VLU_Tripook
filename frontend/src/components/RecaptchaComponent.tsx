import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

interface RecaptchaComponentProps {
  siteKey: string;
  onVerify: (token: string | null) => void;
  onError?: () => void;
  onExpired?: () => void;
  theme?: 'light' | 'dark';
  size?: 'compact' | 'normal' | 'invisible';
}

export interface RecaptchaComponentRef {
  reset: () => void;
  execute: () => void;
  getValue: () => string | null;
}

const RecaptchaComponent = forwardRef<RecaptchaComponentRef, RecaptchaComponentProps>(
  ({ siteKey, onVerify, onError, onExpired, theme = 'light', size = 'normal' }, ref) => {
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
        }
      },
      execute: () => {
        if (recaptchaRef.current) {
          recaptchaRef.current.execute();
        }
      },
      getValue: () => {
        if (recaptchaRef.current) {
          return recaptchaRef.current.getValue();
        }
        return null;
      }
    }));

    const handleChange = (token: string | null) => {
      onVerify(token);
    };

    const handleError = () => {
      if (onError) {
        onError();
      }
    };

    const handleExpired = () => {
      if (onExpired) {
        onExpired();
      }
      // Reset token when expired
      onVerify(null);
    };

    if (!siteKey) {
      return (
        <div className="text-red-500 text-sm">
          reCAPTCHA configuration error
        </div>
      );
    }

    return (
      <div className="flex justify-center my-4">
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={siteKey}
          onChange={handleChange}
          onErrored={handleError}
          onExpired={handleExpired}
          theme={theme}
          size={size}
        />
      </div>
    );
  }
);

RecaptchaComponent.displayName = 'RecaptchaComponent';

export default RecaptchaComponent;