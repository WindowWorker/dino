import fs from 'fs';
import Link from 'next/link';
import { basename, extname, join } from 'path';

let homepage = await (await fetch('https://deno.land')).text();

export async function getStaticProps() {
	const sha = process.env.VERCEL_GIT_COMMIT_SHA || 'master';
	const apiDir = join(process.cwd(), 'api');
	const apiFiles = await fs.promises.readdir(apiDir);
	const examples = apiFiles
		.filter((f) => f.endsWith('.ts') || f.endsWith('.js'));
	return { props: { sha, examples } };
}

export default function Index ({ sha, examples }) {
	return (
    <div><div className="Container" dangerouslySetInnerHTML={{__html: homepage}}>
     </div><script>window.stop();</script></div>
	);
};
