import { Link } from "react-router-dom";
import logo from "../assets/mpsc.in_logo.png";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

export default function RefundPolicy() {
	return (
		<div className="min-h-screen bg-primary p-4 md:p-10">
			<header className="flex justify-between items-center mb-6">
				<Link to="/">
					<img src={logo} alt="Logo" className="w-40" />
				</Link>
				<Button asChild variant="outline">
					<Link to="/signin" className="text-secondary">
						<Icons.login className="mr-2 h-4 w-4 text-secondary" />
						Sign In
					</Link>
				</Button>
			</header>
			<Card>
				<CardHeader>
					<CardTitle>Cancellation and Refund Policy</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6 text-muted-foreground">
					<p className="text-sm">
						Last updated: {new Date().toLocaleDateString()}
					</p>

					<section className="space-y-2">
						<h3 className="font-semibold text-lg text-foreground">
							1. Subscription Period
						</h3>
						<p>
							All our paid subscription plans are valid for a duration of
							**one (1) month** from the date of purchase.
						</p>
					</section>

					<section className="space-y-2">
						<h3 className="font-semibold text-lg text-foreground">
							2. Cancellation Policy
						</h3>
						<p>
							Our subscriptions do not renew automatically. Therefore, no
							cancellation is necessary. Your access to premium features will
							simply expire at the end of your one-month subscription
							period. You will not be charged again unless you manually
							purchase a new subscription.
						</p>
					</section>

					<section className="space-y-2">
						<h3 className="font-semibold text-lg text-foreground">
							3. Refund Policy
						</h3>
						<p>
							**All sales are final. We do not offer refunds or credits for
							any purchases.**
						</p>
						<p>
							Once a subscription is purchased and activated, the payment is
							non-refundable, regardless of whether you use the Service or
							not. We do not provide refunds or credits for partially used
							subscription periods or for any unused portion of your
							subscription.
						</p>
						<p>
							We encourage you to use our free-tier features to evaluate the
							Service before making a purchase.
						</p>
					</section>

					<section className="space-y-2">
						<h3 className="font-semibold text-lg text-foreground">
							4. Contact
						</h3>
						<p>
							If you have any questions about this policy, please contact us
							before making a purchase. You can reach us via our{" "}
							<Link to="/contact" className="text-primary hover:underline">
								Contact Page
							</Link>
							.
						</p>
					</section>
				</CardContent>
			</Card>
		</div>
	);
}