import NewsletterSubscribe from "@/app/(site)/subscribe/components/NewsletterSubscribe";

export default function Subscribe() {
    return (
        <main className="flex w-full min-h-screen flex-col items-center p-6">
            <div className="flex flex-col relative py-[10%] px-[2%] mx-auto ">
                <h2 className="uppercase text-2xl max-w-xl font-light">Stay up to date with Anton&apos;s newest projects, prints for sale and stories</h2>
                <div className="my-8 h-px bg-white w-full"/>
                <div className="w-full">
                    <NewsletterSubscribe/>
                </div>
            </div>
        </main>

    )
}