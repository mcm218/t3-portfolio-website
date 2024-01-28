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

const resumeFormSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email().optional(),
});

const linkFormSchema = z.object({
    name: z.string().min(1),
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
    name: string;
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
import { Combobox } from "../_inputs/combobox";

export function CreateResume() {
    const router = useRouter();

    const [personalLinks, setPersonalLinks] = useState<RawPersonalLink[]>([]);

    const resumeForm = useForm<z.infer<typeof resumeFormSchema>>({
        resolver: zodResolver(resumeFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
        },
    });

    const linkForm = useForm<z.infer<typeof linkFormSchema>>({
        resolver: zodResolver(linkFormSchema),
        defaultValues: {
            name: "",
            url: "",
            type: "other",
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

    const createManyPersonalLinks = api.personalLink.createMany.useMutation({
        onSuccess: () => {
            setPersonalLinks([]);
        },
    });

    function onSubmitResume(values: z.infer<typeof resumeFormSchema>) {
        console.log(values);
        createResume.mutate(values);
    }

    function onSubmitLink(values: z.infer<typeof linkFormSchema>) {
        console.log(values);
        setPersonalLinks((links) => [...links, values]);
        linkForm.setValue("name", "");
        linkForm.setValue("url", "");
        linkForm.setValue("type", "other");
    }

    const linkTypes = [
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

    return (
        <div className="flex items-stretch justify-evenly w-full">
            <Form {...resumeForm}>
                <div
                    className="flex flex-col gap-2"
                    style={{ minWidth: "20rem", maxWidth: "40rem" }}
                >
                    <h2>Resume Form</h2>
                    <form
                        onSubmit={resumeForm.handleSubmit(onSubmitResume)}
                        className="flex flex-col gap-2"
                    >
                        <FormField
                            control={resumeForm.control}
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
                            control={resumeForm.control}
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
                        <FormField
                            control={resumeForm.control}
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
                        {/* Personal Links */}
                        <h2>Personal Links</h2>
                        <ul className="flex flex-col gap-2">
                            {personalLinks.map((link) => (
                                <li key={link.url}>
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        className="flex items-center gap-2"
                                    >
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center">
                                                        <FontAwesomeIcon
                                                            icon={
                                                                {
                                                                    github: faGithub,
                                                                    linkedin:
                                                                        faLinkedin,
                                                                    twitter:
                                                                        faTwitter,
                                                                    facebook:
                                                                        faFacebook,
                                                                    instagram:
                                                                        faInstagram,
                                                                    youtube:
                                                                        faYoutube,
                                                                    twitch: faTwitch,
                                                                    discord:
                                                                        faDiscord,
                                                                    website:
                                                                        faChrome,
                                                                    other: faLink,
                                                                }[link.type]
                                                            }
                                                            className="w-4 h-4"
                                                        />
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center">
                                                        <p>{link.name}</p>
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </a>
                                    <Button
                                        onClick={() => {
                                            setPersonalLinks((links) =>
                                                links.filter(
                                                    (l) => l.url !== link.url,
                                                ),
                                            );
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            className="w-4 h-4"
                                        />
                                    </Button>
                                </li>
                            ))}
                        </ul>
                        <Button
                            type="submit"
                            className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
                            disabled={createResume.isLoading}
                        >
                            {createResume.isLoading
                                ? "Submitting..."
                                : "Submit"}
                        </Button>
                    </form>
                </div>
            </Form>

            <Form {...linkForm}>
                <div
                    className="flex flex-col gap-2"
                    style={{ minWidth: "20rem", maxWidth: "40rem" }}
                >
                    <h2>Add Personal Link</h2>
                    <form
                        onSubmit={linkForm.handleSubmit(onSubmitLink)}
                        className="flex flex-col gap-2"
                    >
                        <FormField
                            control={linkForm.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder="Name"
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

                        <FormField
                            control={linkForm.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl
                                            className="relative"
                                            style={{
                                                backgroundColor: "#2e026d",
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a link type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent
                                            className="flex flex-col gap-2"
                                            style={{
                                                maxHeight: "10rem",
                                                overflowY: "auto",
                                                color: "white",
                                                backgroundColor: "#2e026d",
                                            }}
                                        >
                                            {linkTypes.map((type) => (
                                                <SelectItem
                                                    key={type}
                                                    value={type}
                                                    className="flex items-center gap-2"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={
                                                            {
                                                                github: faGithub,
                                                                linkedin:
                                                                    faLinkedin,
                                                                twitter:
                                                                    faTwitter,
                                                                facebook:
                                                                    faFacebook,
                                                                instagram:
                                                                    faInstagram,
                                                                youtube:
                                                                    faYoutube,
                                                                twitch: faTwitch,
                                                                discord:
                                                                    faDiscord,
                                                                website:
                                                                    faChrome,
                                                                other: faLink,
                                                            }[type]
                                                        }
                                                        className="w-4 h-4 mr-2"
                                                    />
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
                        >
                            <FontAwesomeIcon
                                icon={faPlus}
                                className="w-4 h-4 mr-2"
                            />
                            Add Link
                        </Button>
                    </form>
                </div>
            </Form>
        </div>
    );
}
