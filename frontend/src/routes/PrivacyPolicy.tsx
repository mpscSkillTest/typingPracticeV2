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

export default function PrivacyPolicy() {
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
					<CardTitle>Privacy Policy</CardTitle>
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
							MPSC Skill Test ("we", "us", "our") is committed to protecting
							your privacy. This Privacy Policy explains how we collect, use,
							disclose, and safeguard your information when you use our
							Service.
						</p>
					</section>

					<section className="space-y-2">
						<h3 className="font-semibold text-lg text-foreground">
							2. Data We Collect
						</h3>
						<p>
							We collect personal information that you voluntarily provide to
							us when you register an account:
						</p>
						<ul className="list-disc pl-6 space-y-1">
							<li>
								**Personal Identification Information:** Name, email address,
								and contact number.
							</li>
							<li>
								**Authentication Data:** Passwords and other security
								information used for authentication.
							</li>
						</ul>
						<p>
							We also collect data automatically as you use the Service:
						</p>
						<ul className="list-disc pl-6 space-y-1">
							<li>
								**Data Usage Policy:** We collect data related to your
								performance, including typing results (keystrokes, accuracy,
								errors, backspaces), lesson progress, and
								mock test attempts.
							</li>
							<li>
								**Transaction Information:** We collect details related to
								your subscriptions, such as the plan selected, transaction
								ID, and payment status. We do not store your
								full credit card details.
							</li>
						</ul>
					</section>

					<section className="space-y-2">
						<h3 className="font-semibold text-lg text-foreground">
							3. How We Use Your Data
						</h3>
						<p>
							We use the information we collect for the following purposes:
						</p>
						<ul className="list-disc pl-6 space-y-1">
							<li>
								To create and manage your account.
							</li>
							<li>
								To provide the Service, including tracking your typing
								progress and displaying your results and reports.
							</li>
							<li>
								To process your subscription payments and manage your
								subscription status.
							</li>
							<li>
								To communicate with you regarding your account, such as
								sending confirmation emails or password reset links
								.
							</li>
							<li>
								To respond to your feedback and support requests.
							</li>
						</ul>
					</section>

					<section className="space-y-2">
						<h3 className="font-semibold text-lg text-foreground">
							4. Data Storage and Security
						</h3>
						<p>
							Your data is securely stored using Supabase. We
							implement reasonable security measures to protect your
							information from unauthorized access, use, or disclosure.
						</p>
					</section>

					<section className="space-y-2">
						<h3 className="font-semibold text-lg text-foreground">
							5. Data Sharing
						</h3>
						<p>
							We do not sell, trade, or otherwise transfer your personally
							identifiable information to outside parties, except as necessary
							to provide the Service (e.g., to our payment processor,
							Razorpay).
						</p>
					</section>
				</CardContent>
			</Card>
		</div>
	);
}