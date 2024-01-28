import Link from "next/link";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { CreateResume } from "./_components/create-resume";
import { CreateResume as CreateResumeWizard } from "./_components/wizards/create-resume";
import { CreatePersonalLink } from "./_components/create-personal-link";
import { Wizard } from "./_components/wizard";
import { Suspense } from "react";

export default async function Home() {
    const session = await getServerAuthSession();

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
            <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
                    Michael&apos;s{" "}
                    <span className="text-[hsl(280,100%,70%)]">
                        Resume Builder
                    </span>
                </h1>
                <div className="flex flex-col items-center gap-2">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <p className="text-center text-2xl text-white">
                            {session && (
                                <span>Logged in as {session.user?.name}</span>
                            )}
                        </p>
                        <Link
                            href={
                                session
                                    ? "/api/auth/signout"
                                    : "/api/auth/signin"
                            }
                            className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
                        >
                            {session ? "Sign out" : "Sign in"}
                        </Link>
                    </div>
                </div>

                <CrudShowcase />
            </div>
        </main>
    );
}

function WizardChild(props: WizardChildProps) {
    return (
        <>
            {props.page === 0 && <div>Page 1</div>}
            {props.page === 1 && <div>Page 2</div>}
            {props.page === 2 && <div>Page 3</div>}
        </>
    );
}

async function CrudShowcase() {
    const session = await getServerAuthSession();
    if (!session?.user) return null;

    const resumes = await api.resume.getMyResumes.query();
    return (
        <div className="w-full flex flex-col align-middle">
            <Suspense fallback={<div>Loading...</div>}>
                <CreateResumeWizard />
            </Suspense>

            {/* <div
                className="flex flex-col gap-4 p-4 rounded-lg bg-white/10"
                style={{
                    maxWidth: "40rem",
                }}
            >
                <h2 className="text-2xl font-bold text-center">Your resumes</h2>
                {resumes.length === 0 ? (
                    <p className="text-center">You have no resumes yet.</p>
                ) : (
                    <ul className="flex flex-col gap-2">
                        {resumes.map((resume) => (
                            <li key={resume.id}>{resume.id}</li>
                        ))}
                    </ul>
                )}
            </div> */}

            {/* <CreateResume /> */}
            {/* {resumes.length > 0 && <CreatePersonalLink resumes={resumes} />} */}
        </div>
    );
}
