"use client"
import React, { useState, KeyboardEvent, ChangeEvent } from 'react';
import { decode } from 'html-entities';

interface NewsletterFormProps {
    status: string;
    message: string;
    onValidated: (data: { EMAIL: string }) => boolean;
}

const NewsletterForm: React.FC<NewsletterFormProps> = ({ status, message, onValidated }) => {

    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);

    /**
     * Handle form submit.
     *
     * @return {boolean|null}
     */
    const handleFormSubmit = (): boolean | null => {

        setError(null);

        if (!email) {
            setError('Please enter a valid email address');
            return null;
        }

        const isFormValidated = onValidated({ EMAIL: email });

        // On success return true
        return email.indexOf("@") > -1 && isFormValidated;
    }

    /**
     * Handle Input Key Event.
     *
     * @param event
     */
    const handleInputKeyEvent = (event: KeyboardEvent<HTMLInputElement>): void => {
        setError(null);
        // Number 13 is the "Enter" key on the keyboard
        if (event.key === 'Enter') {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            handleFormSubmit();
        }
    }

    /**
     * Extract message from string.
     *
     * @param {String} message
     * @return {null|string}
     */
    const getMessage = (message: string): string | null => {
        if (!message) {
            return null;
        }
        const result = message?.split('-') ?? null;
        if ("0" !== result?.[0]?.trim()) {
            return decode(message);
        }
        const formattedMessage = result?.[1]?.trim() ?? null;
        return formattedMessage ? decode(formattedMessage) : null;
    }

    return (
        <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="col-span-1 md:col-span-2">
                    <label htmlFor="email-input" className="font-light">Your email</label>
                    <input
                        onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value ?? '')}
                        type="email"
                        placeholder="you@awesome.com"
                        className="mt-1 text-white focus:border-0 focus:ring-0 focus:border-transparent block w-full border-gray-300 bg-transparent py-2.5 text-sm outline-none"
                        onKeyUp={(event: KeyboardEvent<HTMLInputElement>) => handleInputKeyEvent(event)}
                    />
                </div>
                <div className="col-span-1 md:col-span-2">
                        <button className="text-4xl hover:bg-white py-2 hover:text-black font-extralight"
                                onClick={() => handleFormSubmit()}>
                            SUBSCRIBE
                        </button>
                </div>

            </div>
            <div className="text-sm text-gray-500 pt-2 max-w-lg">
                {status === "sending" && <div className="text-sm text-gray-500">Sending...</div>}
                {status === "error" || error ? (
                    <div
                        className="text-sm text-gray-500"
                        dangerouslySetInnerHTML={{__html: error || getMessage(message) || ''}}
                    />
                ) : null}
                {status === "success"  && !error && (
                    <div dangerouslySetInnerHTML={{__html: decode(message)}}/>
                )}
            </div>
        </>
    );
}

export default NewsletterForm;