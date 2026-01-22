import ContactForm from "@/app/(site)/contact/components/contactForm";

export default function Contact() {
    return (
    <main className="flex w-full min-h-screen flex-col items-center p-6">
        <div className="flex flex-col relative py-[10%] px-[2%] mx-auto ">
            <h2 className="uppercase text-2xl font-light">Contact</h2>
            <div className="my-8 h-px bg-white w-full max-w-full"/>
            <div className="w-full flex-row">
                <div className="text-4xl font-extralight">anton [at] bossenbroek [dot] photo</div>
                <div className="py-8 text-2xl font-extralight">Or</div>
                <ContactForm/>
            </div>
        </div>
    </main>

    )
}