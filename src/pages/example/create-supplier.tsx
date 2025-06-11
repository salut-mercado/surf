import { Button } from "~/components/ui/button";
import { useCreateSupplier } from "./use-create-supplier";
import { Loader2 } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";

const randomString = () => {
    return Math.random().toString(36).substring(2, 15);
};

export const CreateSupplier = () => {
    const { mutateAsync, isPending } = useCreateSupplier();
    const form = useForm({
        defaultValues: {
            agent: "",
            supplierCode: "",
            supplierName: "",
            phone: "",
            delayDays: 1,
            analytics: true,
            blocked: false,
            comments: "",
            taxID: "",
        },
        onSubmit: async ({ value }) => {
            await mutateAsync({
                suppliersSchema: {
                    ...value,
                    agent: value.agent || randomString(),
                    supplierCode: value.supplierCode || randomString(),
                    supplierName: value.supplierName || randomString(),
                    phone: value.phone || randomString(),
                    taxID: value.taxID || randomString(),
                },
            });
        },
    });
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                void form.handleSubmit();
            }}
            className="space-y-4 p-4"
        >
            <form.Field
                name="agent"
                children={(field) => (
                    <div className="flex flex-col gap-2">
                        <Label htmlFor={field.name}>Agent</Label>
                        <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                        />
                    </div>
                )}
            />
            <form.Field
                name="supplierCode"
                children={(field) => (
                    <div className="flex flex-col gap-2">
                        <Label htmlFor={field.name}>Supplier Code</Label>
                        <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                        />
                    </div>
                )}
            />
            <form.Field
                name="supplierName"
                children={(field) => (
                    <div className="flex flex-col gap-2">
                        <Label htmlFor={field.name}>Supplier Name</Label>
                        <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                        />
                    </div>
                )}
            />
            <form.Field
                name="phone"
                children={(field) => (
                    <div className="flex flex-col gap-2">
                        <Label htmlFor={field.name}>Phone</Label>
                        <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                        />
                    </div>
                )}
            />
            <form.Field
                name="delayDays"
                children={(field) => (
                    <div className="flex flex-col gap-2">
                        <Label htmlFor={field.name}>Delay Days</Label>
                        <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            type="number"
                            onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                        />
                    </div>
                )}
            />
            <form.Field
                name="comments"
                children={(field) => (
                    <div className="flex flex-col gap-2">
                        <Label htmlFor={field.name}>Comments</Label>
                        <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                        />
                    </div>
                )}
            />
            <form.Field
                name="taxID"
                children={(field) => (
                    <div className="flex flex-col gap-2">
                        <Label htmlFor={field.name}>Tax ID</Label>
                        <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                        />
                    </div>
                )}
            />
            <form.Field
                name="analytics"
                children={(field) => (
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id={field.name}
                            name={field.name}
                            checked={field.state.value}
                            onBlur={field.handleBlur}
                            onCheckedChange={(checked) => field.handleChange(Boolean(checked))}
                        />
                        <Label htmlFor={field.name}>Analytics</Label>
                    </div>
                )}
            />
            <form.Field
                name="blocked"
                children={(field) => (
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id={field.name}
                            name={field.name}
                            checked={field.state.value}
                            onBlur={field.handleBlur}
                            onCheckedChange={(checked) => field.handleChange(Boolean(checked))}
                        />
                        <Label htmlFor={field.name}>Blocked</Label>
                    </div>
                )}
            />
            <form.Subscribe
                selector={(state) => state.canSubmit}
                children={(canSubmit) => (
                    <Button type="submit" disabled={!canSubmit || isPending}>
                        {isPending ? <Loader2 className="animate-spin" /> : "Create"}
                    </Button>
                )}
            />
        </form>
    );
};
