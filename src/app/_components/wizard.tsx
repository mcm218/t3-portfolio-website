"use client";

import * as React from "react";

// TODO: useWizardHook

export interface WizardChildProps {
    page?: number;
    next: () => void;
}

export interface WizardFunctionData {
    page: number;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

interface WizardProps {
    page?: number;
    numPages: number;
    title?: string;
    onCancel: (data: WizardFunctionData) => boolean | Promise<boolean>;
    onBack: (data: WizardFunctionData) => boolean | Promise<boolean>;
    onNext: (data: WizardFunctionData) => boolean | Promise<boolean>;
    onSubmit: (data: WizardFunctionData) => boolean | Promise<boolean>;
    children: React.ReactElement;
    className?: string;
}

export function Wizard(props: WizardProps) {
    const [isLoading, setIsLoading] = React.useState(false);
    const [page, setPage] = React.useState(props.page ?? 0);

    const onCancel = async () => {
        if (await props.onCancel({ page, setIsLoading })) {
            setPage(0);
        }
    };

    const onBack = async () => {
        if (await props.onBack({ page, setIsLoading })) {
            setPage(page - 1);
        }
    };

    const onNext = async () => {
        if (
            await props.onNext({
                page,
                setIsLoading,
            })
        ) {
            setPage(page + 1);
        }
    };

    const onSubmit = async () => {
        await props.onSubmit({
            page,
            setIsLoading,
        });
    };

    const renderChildren = () => {
        return React.cloneElement(props.children, {
            page,
            next: () => {
                setPage(page + 1);
            },
        });
    };

    return (
        <div
            className={
                "flex flex-col align-middle justify-center" + props.className
            }
        >
            <div className="flex justify-center items-center mb-4">
                <div className="text-xl font-medium">{props.title ?? ""}</div>
                <div className="text-sm text-muted-foreground">
                    {/* purple circle for passed steps, gray circle for upcoming steps */}
                    {Array.from({ length: props.numPages }).map((_, i) => (
                        <div
                            key={i}
                            className={`inline-block rounded-full w-2 h-2 ${
                                i < page ? "bg-purple-500" : "bg-gray-500"
                            }`}
                        />
                    ))}
                </div>
            </div>
            {isLoading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="spinner">...</div>
                </div>
            ) : (
                renderChildren()
            )}
            <div className="flex justify-end">
                <button
                    className="btn btn-outline"
                    onClick={async () => {
                        setIsLoading(true);
                        if (page === 0) {
                            await onCancel();
                        } else {
                            await onBack();
                        }
                    }}
                    disabled={page === 0}
                >
                    {page === 0 ? "Cancel" : "Back"}
                </button>
                <button
                    className="btn btn-primary ml-2"
                    onClick={async () => {
                        if (page === props.numPages - 1) {
                            await onSubmit();
                        } else {
                            await onNext();
                        }
                    }}
                >
                    {page === props.numPages - 1 ? "Submit" : "Next"}
                </button>
            </div>
        </div>
    );
}
