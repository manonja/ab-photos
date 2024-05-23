'use client'
import MailchimpSubscribe, { EmailFormFields } from 'react-mailchimp-subscribe';
import NewsletterForm from "@/app/subscribe/components/newsletterForm";

const NewsletterSubscribe = () => {

    const MAILCHIMP_URL = process.env.NEXT_PUBLIC_MAILCHIMP_URL;
    console.log('MAILCHIMP_URL', MAILCHIMP_URL)

    return (
        <MailchimpSubscribe
            // @ts-ignore
            url={MAILCHIMP_URL}
            render={(props) => {
                const {subscribe, status, message} = props || {};
                return (
                    <NewsletterForm
                        // @ts-ignore
                        status={status}
                        // @ts-ignore
                        message={message}
                        // @ts-ignore
                        onValidated={(formData: EmailFormFields) => subscribe( formData ) }
                    />
                );
            } }
        />
    );
};

export default NewsletterSubscribe;