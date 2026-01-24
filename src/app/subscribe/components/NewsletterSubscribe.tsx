'use client'
import MailchimpSubscribe, { type EmailFormFields } from 'react-mailchimp-subscribe'
import NewsletterForm from '@/app/subscribe/components/newsletterForm'

const NewsletterSubscribe = () => {
  const MAILCHIMP_URL = process.env.NEXT_PUBLIC_MAILCHIMP_URL

  return (
    <MailchimpSubscribe
      // @ts-expect-error
      url={MAILCHIMP_URL}
      render={(props) => {
        const { subscribe, status, message } = props || {}
        return (
          <NewsletterForm
            // @ts-expect-error
            status={status}
            // @ts-expect-error
            message={message}
            // @ts-expect-error
            onValidated={(formData: EmailFormFields) => subscribe(formData)}
          />
        )
      }}
    />
  )
}

export default NewsletterSubscribe
