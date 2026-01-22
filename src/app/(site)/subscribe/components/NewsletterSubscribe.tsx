'use client'
import MailchimpSubscribe, { EmailFormFields } from 'react-mailchimp-subscribe';
import NewsletterForm from "@/app/(site)/subscribe/components/newsletterForm";

const NewsletterSubscribe = () => {

    const MAILCHIMP_URL = process.env.NEXT_PUBLIC_MAILCHIMP_URL;

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