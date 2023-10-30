import fs from 'fs';
import Link from 'next/link';
import { basename, extname, join } from 'path';
import './link-resolver.js';
import './text-rewriter.js';

let homepage = await (await fetch('https://deno.land')).text();
let injectScripts=globalThis['link-resolver-import']+globalThis['text-rewriter'];

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
     </div>
      <div className="Container" dangerouslySetInnerHTML={{__html: injectScripts}}>
         </div>
      <script>window.stop();</script>
      <style>html *{color:rebeccapurple !important;}</style>
    </div>
	);
};
