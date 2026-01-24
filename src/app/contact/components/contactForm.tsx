import type React from 'react'

const MAILCHIMP_CONTACT_URL = process.env.NEXT_PUBLIC_CONTACT_FORM_URL

const ContactForm: React.FC = () => {
  return (
    <div className="contact-form-container">
      <form action={MAILCHIMP_CONTACT_URL} method="post">
        <button
          className="text-4xl hover:bg-white py-2 hover:text-black font-extralight"
          type="submit"
        >
          SEND A MESSAGE HERE
        </button>
      </form>
    </div>
  )
}

export default ContactForm
