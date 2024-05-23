export async function subscribeUser(setMessage: (arg0: string) => void, setEmail: (arg0: string) => void, email: string){
    console.log('I AM HIT!')
    console.log('EMAIL SENT', email)

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subscribeUser`, {
        body: JSON.stringify({
            email: email,
        }),
        headers: {
            Authorization: `apikey ${process.env.NEXT_PUBLIC_MAILCHIMP_API_KEY}`,
            'Content-Type': 'application/json',
        },
        method: 'POST',
    });

    // @ts-ignore
    const { error } = await res.json();
    if (error) {
        setMessage(error);
        return;
    }

    setEmail('');
    setMessage('Success! 🎉 You are now subscribed to the newsletter.');
}