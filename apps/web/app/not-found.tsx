import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function NotFound(){return <div className="grid min-h-[55vh] place-items-center text-center"><div><p className="font-mono text-sm text-primary">404 · NOT IN THE CATALOG</p><h1 className="mt-3 text-3xl font-semibold">We couldn’t find that page.</h1><p className="mt-2 text-muted-foreground">The content may have moved or the address may be mistyped.</p><Button asChild className="mt-5"><Link href="/">Return to overview</Link></Button></div></div>}
