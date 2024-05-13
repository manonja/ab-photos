import Link from 'next/link';
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode } from 'react';
import {getProjectsDetails} from "@/actions/getProjectsDetails";
export const runtime = "edge"


const WorkList = async () => {
    const projects = await getProjectsDetails()

    return (
        <div className="mb-32 grid text-center p-6 lg:max-w-7xl gap-2 lg:mb-0 lg:grid-cols-2 lg:text-right self-end">
            {projects.map((project: { id: Key | null | undefined; slug: any; title: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; }) => (
                <div key={project.id}>
                    <Link
                        href={`/work/${project.slug || ''}`}>
                        <h2 className={`group p-2 bg-black text-white px-5 relative transition-colors hover:bg-white hover:text-black align-middle m-2 text-4xl font-semibold`}>{project.title}</h2> </Link>
                </div>
            ))}
        </div>


    );
}
export default WorkList