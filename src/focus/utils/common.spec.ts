import {clamp, overflow} from './common'

it('clamp values', () => {
	expect(clamp(10, 0, 100)).toEqual(10);
	expect(clamp(10, 20, 100)).toEqual(20);
	expect(clamp(10, 0, 5)).toEqual(5);
	expect(clamp(0, 0, 100)).toEqual(0);
	expect(clamp(100, 0, 100)).toEqual(100);
	expect(clamp(100, 100, 0)).toEqual(0);
});

it('overflow values', () => {
	expect(overflow(10, 0, 100)).toEqual(10);
	expect(overflow(10, 20, 100)).toEqual(100);
	expect(overflow(10, 0, 5)).toEqual(0);
	expect(overflow(0, 0, 100)).toEqual(0);
	expect(overflow(100, 0, 100)).toEqual(100);

	expect(overflow(100, 100, 0)).toEqual(100);
})

