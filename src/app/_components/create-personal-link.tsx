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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import * as z from "zod";

const formSchema = z.object({
    name: z.string().min(1),
    url: z.string().url(),
    resumeId: z.string(),
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

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { PersonalLink } from "@prisma/client";

interface ForExistingResumesProp {
    resumes: Resume[];
}

interface Resume {
    id: string;
}

export function CreatePersonalLink(props: ForExistingResumesProp) {
    const router = useRouter();

    const resumes = "resumes" in props ? props.resumes : [];

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            url: "",
            resumeId: "",
            type: "other",
        },
    });

    const createPersonalLink = api.personalLink.create.useMutation({
        onSuccess: clearAndRefreshRouter,
    });

    function submitForm(values: z.infer<typeof formSchema>) {
        console.log(values);
        createPersonalLink.mutate(values);
    }

    function clearAndRefreshRouter() {
        form.setValue("name", "");
        form.setValue("url", "");
        form.setValue("resumeId", "");
        form.setValue("type", "other");
        router.refresh();
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(submitForm)}
                className="flex flex-col gap-2"
            >
                <FormField
                    control={form.control}
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
                    control={form.control}
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
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a link type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="github">
                                        Github
                                    </SelectItem>
                                    <SelectItem value="linkedin">
                                        LinkedIn
                                    </SelectItem>
                                    <SelectItem value="twitter">
                                        Twitter
                                    </SelectItem>
                                    <SelectItem value="facebook">
                                        Facebook
                                    </SelectItem>
                                    <SelectItem value="instagram">
                                        Instagram
                                    </SelectItem>
                                    <SelectItem value="youtube">
                                        Youtube
                                    </SelectItem>
                                    <SelectItem value="twitch">
                                        Twitch
                                    </SelectItem>
                                    <SelectItem value="discord">
                                        Discord
                                    </SelectItem>
                                    <SelectItem value="website">
                                        Website
                                    </SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {resumes && resumes.length > 0 && (
                    <FormField
                        control={form.control}
                        name="resumeId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Resume</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a resume" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {resumes.map((resume) => (
                                            <SelectItem
                                                key={resume.id}
                                                value={resume.id}
                                            >
                                                {resume.id}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <Button
                    type="submit"
                    className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
                    disabled={createPersonalLink.isLoading}
                >
                    {createPersonalLink.isLoading ? "Submitting..." : "Submit"}
                </Button>
            </form>
        </Form>
    );
}
