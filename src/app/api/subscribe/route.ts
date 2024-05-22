import { NextRequest, NextResponse } from 'next/server';

export const runtime = "edge";

export async function POST(req: NextRequest) {
    // @ts-ignore
    const { email } = await req.json();

    console.log("EMAIL", email)

    if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    try {
        const AUDIENCE_ID = process.env.NEXT_PUBLIC_MAILCHIMP_AUDIENCE_ID; // Replace with your actual audience ID
        const DATACENTER = process.env.NEXT_PUBLIC_MAILCHIMP_API_SERVER;
        const API_KEY = process.env.NEXT_PUBLIC_MAILCHIMP_API_KEY; // Ensure this is set in your environment variables

        const data = {
            email_address: email,
            status: 'subscribed',
        };

        const response = await fetch(
            `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`,
            {
                body: JSON.stringify(data),
                headers: {
                    Authorization: `apikey ${API_KEY}`,
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            }
        );

        const responseData = await response.json();
        console.log('Mailchimp API Response:', responseData);


        if (response.status >= 400) {
            return NextResponse.json(
                { error: 'There was an error subscribing to the newsletter.' },
                { status: 400 }
            );
        }

        return NextResponse.json({ error: '' }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            // @ts-ignore
            { error: error.message || error.toString() },
            { status: 500 }
        );
    }
}