import React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Mail, Shield } from "lucide-react"; // Add icons

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
		<form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-8">
			<div>
				<h3 className="mb-4 text-lg font-medium flex items-center gap-2">
					<Mail className="w-5 h-5 text-blue-600" />
					Email Notifications
				</h3>
				<div className="space-y-6">
					<Controller
						control={control}
						name="marketing_emails"
						render={({ field }) => (
							<div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-white gap-4">
								<div className="flex items-start gap-3">
									<Mail className="w-5 h-5 text-teal-600 mt-1" />
									<div>
										<label className="font-medium">Marketing emails</label>
										<div className="text-sm text-gray-500">
											Receive emails about new products, features, and more.
										</div>
										<p className="text-xs text-gray-400 mt-1">
											You can unsubscribe at any time.
										</p>
									</div>
								</div>
								<Switch
									checked={!!field.value}
									onCheckedChange={field.onChange}
									id="marketing_emails"
									aria-describedby="marketing_emails-helper"
								/>
							</div>
						)}
					/>
					<Controller
						control={control}
						name="security_emails"
						render={({ field }) => (
							<div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-white gap-4">
								<div className="flex items-start gap-3">
									<Shield className="w-5 h-5 text-teal-600 mt-1" />
									<div>
										<label className="font-medium">Security emails</label>
										<div className="text-sm text-gray-500">
											Receive emails about your account security.
										</div>
										<p className="text-xs text-gray-400 mt-1">
											Required for important security alerts.
										</p>
									</div>
								</div>
								<Switch
									checked={!!field.value}
									onCheckedChange={field.onChange}
									disabled
									aria-readonly
									id="security_emails"
									aria-describedby="security_emails-helper"
								/>
							</div>
						)}
					/>
				</div>
				{errors.marketing_emails && (
					<p className="text-xs text-red-600 mt-2" id="marketing_emails-helper">
						{errors.marketing_emails.message}
					</p>
				)}
				{errors.security_emails && (
					<p className="text-xs text-red-600 mt-2" id="security_emails-helper">
						{errors.security_emails.message}
					</p>
				)}
			</div>
			<div className="flex justify-end">
				<Button type="submit" className="px-6 py-2">
					Submit
				</Button>
			</div>
		</form>
	);
}
