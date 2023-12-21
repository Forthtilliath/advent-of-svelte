import { json } from '@sveltejs/kit';
import { days } from './data';

export function GET() {
	return json(days);
}
