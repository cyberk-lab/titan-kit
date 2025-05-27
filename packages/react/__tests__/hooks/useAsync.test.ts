import { renderHook, act, waitFor, cleanup } from '@testing-library/react';
import { useAsync, cache, activeRequests } from '../../src/hooks/useAsync';

describe('useAsync', () => {
    beforeEach(() => {
        cache.clear();
        activeRequests.clear();
    });
    afterEach(cleanup)

    it('should return initial state', async () => {
        const { result } = renderHook(() =>
            useAsync({
                queryKey: 'test1',
                queryFn: async () => 'data',
            })
        );
        await waitFor(() => {
            expect(result.current.data).toBeNull();
            expect(result.current.isLoading).toBe(true);
            expect(result.current.error).toBeNull();
        })

    });

    it('should fetch data and update state', async () => {
        const queryFn = jest.fn().mockResolvedValue('data');

        const { result } = renderHook(() =>
            useAsync({
                queryKey: 'test2',
                queryFn,
            })
        );

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.data).toBe('data');
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(queryFn).toHaveBeenCalledTimes(1);
    });

    it('should handle errors', async () => {
        const queryFn = jest.fn().mockRejectedValue(new Error('Error occurred'));

        const { result } = renderHook(() =>
            useAsync({
                queryKey: 'test3',
                queryFn,
            })
        );

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.data).toBeNull();
        expect(result.current.error?.message).toEqual('Error occurred');
    });

    it('should use cached data if available', async () => {
        cache.set('test4', 'cachedData');

        const queryFn = jest.fn().mockResolvedValue('data');

        const { result } = renderHook(() =>
            useAsync({
                queryKey: 'test4',
                queryFn,
            })
        );

        expect(result.current.data).toBe('cachedData');
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(queryFn).not.toHaveBeenCalled();
    });

    it('should refetch data when refetch is called', async () => {
        const queryFn = jest.fn().mockResolvedValue('data');

        const { result } = renderHook(() =>
            useAsync({
                queryKey: 'test5',
                queryFn,
            })
        );

        await waitFor(async () => {
            await expect(result.current.isLoading).toBe(false);
        });
        expect(result.current.data).toBe('data');

        expect(result.current.data).toBe('data');

        queryFn.mockResolvedValue('newData');

        await act(async () => {
            await result.current.refetch();
        });

        expect(result.current.data).toBe('newData');
        expect(queryFn).toHaveBeenCalledTimes(2);
    });

    it('should not fetch data if enabled is false', () => {
        const queryFn = jest.fn();

        const { result } = renderHook(() =>
            useAsync({
                queryKey: 'test6',
                queryFn,
                enabled: false,
            })
        );

        expect(result.current.data).toBeNull();
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(queryFn).not.toHaveBeenCalled();
    });
});