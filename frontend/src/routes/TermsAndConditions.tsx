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

export default function TermsAndConditions() {
	return (
		<div className="min-h-screen bg-primary p-4 md:p-10">
			<header className="flex justify-between items-center mb-6">
				<Link to="/">
					<img src={logo} alt="Logo" className="w-40" />
				</Link>
				<Button asChild variant="outline">
					<Link to="/signin" className="text-secondary">
						<Icons.login className="mr-2 h-4 w-4 text-secondary"  />
						Sign In
					</Link>
				</Button>
			</header>
			<Card>
				<CardHeader>
					<CardTitle>Terms and Conditions</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6 text-muted-foreground">
					<p className="text-sm">
						Last updated: {new Date().toLocaleDateString()}
					</p>

					<section className="space-y-2">
						<h3 className="font-semibold text-lg text-foreground">
							1. Introduction
						</h3>
						<p>
							Welcome to MPSC Skill Test ("we", "us", "our"). These Terms and
							Conditions govern your use of our typing practice application (the
							"Service"). By accessing or using the Service, you agree to be
							bound by these Terms.
						</p>
					</section>

					<section className="space-y-2">
						<h3 className="font-semibold text-lg text-foreground">
							2. User Accounts
						</h3>
						<p>
							To access most features of the Service, you must register for an
							account. You agree to provide accurate, current, and complete
							information during the registration process. You are
							responsible for safeguarding your password and for any activities
							or actions under your account.
						</p>
					</section>

					<section className="space-y-2">
						<h3 className="font-semibold text-lg text-foreground">
							3. Subscriptions
						</h3>
						<p>
							Our Service is offered on a subscription basis. We offer various
							plans, including monthly subscriptions.
						</p>
						<ul className="list-disc pl-6 space-y-1">
							<li>
								**Subscription Time:** All paid subscription plans are valid
								for a period of **one (1) month** from the date of purchase.
							</li>
							<li>
								**Billing:** Payment is due at the time of purchase. Your
								subscription will not automatically renew. You will need to
								purchase a new subscription to continue access after your
								one-month period expires.
							</li>
							<li>
								**Access:** Paid subscriptions grant you access to premium
								features, such as additional practice passages, lessons, and
								mock tests, as detailed on our subscription page.
							</li>
						</ul>
					</section>

					<section className="space-y-2">
						<h3 className="font-semibold text-lg text-foreground">
							4. Acceptable Use
						</h3>
						<p>You agree not to use the Service to:</p>
						<ul className="list-disc pl-6 space-y-1">
							<li>
								Violate any laws or regulations.
							</li>
							<li>
								Share your account credentials with any third party.
							</li>
							<li>
								Attempt to reverse-engineer, decompile, or otherwise access
								the source code of the Service.
							</li>
						</ul>
					</section>

					<section className="space-y-2">
						<h3 className="font-semibold text-lg text-foreground">
							5. Termination
						</h3>
						<p>
							We may terminate or suspend your access to the Service
							immediately, without prior notice or liability, for any reason
							whatsoever, including without limitation if you breach these
							Terms.
						</p>
					</section>

					<section className="space-y-2">
						<h3 className="font-semibold text-lg text-foreground">
							6. Changes to Terms
						</h3>
						<p>
							We reserve the right, at our sole discretion, to modify or
							replace these Terms at any time. We will provide notice of any
							changes by posting the new Terms on this page.
						</p>
					</section>
				</CardContent>
			</Card>
		</div>
	);
}