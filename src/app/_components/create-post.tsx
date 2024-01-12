"use client";

import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";

const formSchema = z.object({
    name: z.string().min(1),
});

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export function CreatePost() {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    const createPost = api.post.create.useMutation({
        onSuccess: () => {
            router.refresh();
            form.setValue("name", "");
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        createPost.mutate(values);
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-2"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    placeholder="Title"
                                    {...field}
                                    className="w-full rounded-full px-4 py-2 text-black"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
                    disabled={createPost.isLoading}
                >
                    {createPost.isLoading ? "Submitting..." : "Submit"}
                </Button>
            </form>
        </Form>
    );
}
