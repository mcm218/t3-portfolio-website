"use client";

import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/components/ui/tooltip";

import * as z from "zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faGithub,
    faLinkedin,
    faTwitter,
    faFacebook,
    faInstagram,
    faYoutube,
    faTwitch,
    faDiscord,
    faChrome,
} from "@fortawesome/free-brands-svg-icons";

import { faPlus, faTrash, faLink } from "@fortawesome/free-solid-svg-icons";

const personalInfoFormSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email().optional(),
});

const personalLinksFormSchema = z.object({
    personalLinks: z.array(
        z.object({
            label: z.string().min(1),
            url: z.string().url(),
            type: z.enum([
                "github",
                "linkedin",
                "twitter",
                "facebook",
                "instagram",
                "youtube",
                "twitch",
                "discord",
                "website",
                "other",
            ]),
        }),
    ),
});

const linkFormSchema = z.object({
    label: z.string().min(1),
    url: z.string().url(),
    type: z.enum([
        "github",
        "linkedin",
        "twitter",
        "facebook",
        "instagram",
        "youtube",
        "twitch",
        "discord",
        "website",
        "other",
    ]),
});

interface RawPersonalLink {
    label: string;
    url: string;
    type:
        | "github"
        | "linkedin"
        | "twitter"
        | "facebook"
        | "instagram"
        | "youtube"
        | "twitch"
        | "discord"
        | "website"
        | "other";
}

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Resume } from "@prisma/client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Wizard } from "../wizard";
import type { WizardChildProps } from "../wizard";
import { Combobox } from "~/app/_inputs/combobox";

// TODO: Move to a resources file
const linkTypeTypes = [
    "github",
    "linkedin",
    "twitter",
    "facebook",
    "instagram",
    "youtube",
    "twitch",
    "discord",
    "website",
    "other",
] as const;

const linkTypes = {
    github: "github",
    linkedin: "linkedin",
    twitter: "twitter",
    facebook: "facebook",
    instagram: "instagram",
    youtube: "youtube",
    twitch: "twitch",
    discord: "discord",
    website: "website",
    other: "other",
};

export function CreateResume() {
    const router = useRouter();

    const [page, setPage] = useState(0);
    const [personalLinks, setPersonalLinks] = useState<RawPersonalLink[]>([]);

    const resumeForm = useForm<z.infer<typeof personalInfoFormSchema>>({
        resolver: zodResolver(personalInfoFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
        },
    });

    const createResume = api.resume.create.useMutation({
        onSuccess: (resume: Resume) => {
            resumeForm.setValue("firstName", "");
            resumeForm.setValue("lastName", "");
            resumeForm.setValue("email", "");
            if (personalLinks.length > 0) {
                createManyPersonalLinks.mutate(
                    personalLinks.map((link) => ({
                        ...link,
                        resumeId: resume.id,
                    })),
                );
            }
            router.refresh();
        },
    });

    const createManyPersonalLinks = api.personalLink.createMany.useMutation({});

    return (
        <Wizard
            className="flex flex-col align-middle justify-center"
            page={0}
            numPages={3}
            onCancel={() => {
                console.log("cancel");
                return true;
            }}
            onBack={() => {
                console.log("back");
                setPage(page - 1);
                return true;
            }}
            onNext={(data) => {
                console.log("next");

                if (data.page === 0) {
                    if (resumeForm.formState.isValid) {
                        setPage(data.page + 1);
                        return true;
                    }
                    return false;
                }
                return true;
            }}
            onSubmit={() => {
                console.log("submit");
                return true;
            }}
        >
            <>
                {/* Page 1 */}
                {page === 0 ? (
                    <PersonalInformationPage form={resumeForm} />
                ) : (
                    <></>
                )}
                {/* Page 2 */}
                {page === 1 ? (
                    <PersonalLinksPage
                        personalLinks={personalLinks}
                        setPersonalLinks={setPersonalLinks}
                    />
                ) : (
                    <></>
                )}
                {/* Page 3 */}
            </>
        </Wizard>
    );
}

interface ResumeFormProps {
    form: ReturnType<typeof useForm<z.infer<typeof personalInfoFormSchema>>>;
}

const PersonalInformationPage = (
    props: Partial<WizardChildProps> & ResumeFormProps,
) => {
    return (
        <Form key="personal information" {...props.form}>
            <form
                onSubmit={props.next}
                className="flex flex-col items-center gap-2"
            >
                <div className="flex items-center gap-2">
                    <FormField
                        control={props.form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        placeholder="First Name"
                                        {...field}
                                        className="w-full rounded-full px-4 py-2 text-black"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={props.form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        placeholder="Last Name"
                                        {...field}
                                        className="w-full rounded-full px-4 py-2 text-black"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div>
                    <FormField
                        control={props.form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        placeholder="Email"
                                        {...field}
                                        className="w-full rounded-full px-4 py-2 text-black"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </form>
        </Form>
    );
};

interface PersonalLinksFormProps {
    personalLinks: RawPersonalLink[];
    setPersonalLinks: (links: RawPersonalLink[]) => void;
}

const PersonalLinksPage = (
    props: Partial<WizardChildProps> & PersonalLinksFormProps,
) => {
    const [personalLinks, setLocalPersonalLinks] = useState<RawPersonalLink[]>(
        props.personalLinks,
    );

    const linkForm = useForm<z.infer<typeof linkFormSchema>>({
        resolver: zodResolver(linkFormSchema),
        defaultValues: {
            label: "",
            url: "",
            type: "other",
        },
    });

    const removePersonalLink = (index: number) => {
        const newLinks = personalLinks.filter((_, i) => i !== index);
        setLocalPersonalLinks(newLinks);
        props.setPersonalLinks(newLinks);
    };

    const renderPersonalLinks = (links: RawPersonalLink[] = []) => {
        return (
            <ul className="flex flex-col gap-2">
                {links.map((link, i) => (
                    <li
                        key={i}
                        className="flex flex-row items-center justify-between gap-2"
                    >
                        <span>{link.label}</span>
                        <span>{link.url}</span>
                        <span>{link.type}</span>
                        <Button
                            onClick={() => {
                                removePersonalLink(i);
                            }}
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </Button>
                    </li>
                ))}
            </ul>
        );
    };

    const pushPersonalLink = (link: RawPersonalLink) => {
        const newLinks = [...personalLinks, link];
        setLocalPersonalLinks(newLinks);
        props.setPersonalLinks(newLinks);
    };

    return (
        <>
            {/* Current Personal Links */}
            {renderPersonalLinks(personalLinks)}
            {/* Personal Link Form */}
            <Form key="personal links" {...linkForm}>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        pushPersonalLink(linkForm.getValues());
                        linkForm.setValue("label", "");
                        linkForm.setValue("url", "");
                        linkForm.setValue("type", "other");
                    }}
                    className="flex flex-col items-center gap-2"
                >
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <FormField
                                control={linkForm.control}
                                name="label"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                placeholder="Label"
                                                {...field}
                                                className="w-full rounded-full px-4 py-2 text-black"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={linkForm.control}
                                name="url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                placeholder="URL"
                                                {...field}
                                                className="w-full rounded-full px-4 py-2 text-black"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <FormField
                                control={linkForm.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <Combobox
                                            onChange={field.onChange}
                                            value={field.value}
                                            options={Object.values(linkTypes)}
                                            placeholder="Select a type"
                                        ></Combobox>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">
                                <FontAwesomeIcon icon={faPlus} />
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </>
    );
};
