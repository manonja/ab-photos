"use client"
import React, { useState } from 'react';
import {subscribeUser} from "@/actions/subscribeUser";

export const runtime = "edge"

const SubscribeForm = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    return (
        <form onSubmit={() => subscribeUser(setMessage, setEmail, email)} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="col-span-1 md:col-span-2">
                <label htmlFor="email-input" className="font-light">Your email</label>
                <input
                    id="email-input"
                    name="email"
                    placeholder="you@awesome.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    type="email"
                    className="mt-1 text-white focus:border-0 focus:ring-0 focus:border-transparent block w-full border-gray-300 bg-transparent py-2.5 text-sm outline-none"

                />
            </div>
            <div className="col-span-1 md:col-span-2">
                <div
                    className="text-sm text-gray-500">{message ? message : `You will only receive emails when new content is posted. No spam.`}</div>
                <button type="submit"
                        className="mt-2 p-2 bg-white font-light hover:bg-fuchsia-500 hover:text-white uppercase text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >Subscribe
                </button>
            </div>

        </form>
);
};

export default SubscribeForm;