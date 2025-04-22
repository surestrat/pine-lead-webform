import React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const FormSchema = z.object({
	marketing_emails: z.boolean().default(false).optional(),
	security_emails: z.boolean(),
});

export function SwitchForm() {
	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			marketing_emails: false,
			security_emails: true,
		},
	});

	const onSubmit = (data) => {
		alert(
			"You submitted the following values:\n" + JSON.stringify(data, null, 2)
		);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
			<div>
				<h3 className="mb-4 text-lg font-medium">Email Notifications</h3>
				<div className="space-y-4">
					<Controller
						control={control}
						name="marketing_emails"
						render={({ field }) => (
							<div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
								<div>
									<label className="font-medium">Marketing emails</label>
									<div className="text-sm text-gray-500">
										Receive emails about new products, features, and more.
									</div>
								</div>
								<Switch
									checked={!!field.value}
									onCheckedChange={field.onChange}
								/>
							</div>
						)}
					/>
					<Controller
						control={control}
						name="security_emails"
						render={({ field }) => (
							<div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
								<div>
									<label className="font-medium">Security emails</label>
									<div className="text-sm text-gray-500">
										Receive emails about your account security.
									</div>
								</div>
								<Switch
									checked={!!field.value}
									onCheckedChange={field.onChange}
									disabled
									aria-readonly
								/>
							</div>
						)}
					/>
				</div>
			</div>
			<Button type="submit">Submit</Button>
		</form>
	);
}
