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

export default function ContactUs() {
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
					<CardTitle>Contact Us</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6 text-muted-foreground">
					<section className="space-y-2">
						<h3 className="font-semibold text-lg text-foreground">
							Get in Touch
						</h3>
						<p>
							Have questions about our service, subscriptions, or policies?
							We're here to help!
						</p>
					</section>

					<section className="space-y-2">
						<h3 className="font-semibold text-lg text-foreground">
							Support Email
						</h3>
						<p>
							For all inquiries, please email us at:
							<br />
							<a
								href="mailto:support@mpscskilltest.in"
								className="text-primary font-medium hover:underline"
							>
								support@mpscskilltest.in
							</a>
						</p>
                        <p>
							or contact us at:
							<br />
							<a
								className="text-primary font-medium hover:underline"
							>
								+91 8623855955
							</a>
						</p>
					</section>

					<section className="space-y-2">
						<h3 className="font-semibold text-lg text-foreground">
							Feedback
						</h3>
						<p>
							If you are an existing user and wish to submit feedback, please
							<Link to="/signin" className="text-primary hover:underline mx-1">
								sign in
							</Link>
							and use the "Contact Us" help icon in your dashboard.
						</p>
					</section>
				</CardContent>
			</Card>
		</div>
	);
}