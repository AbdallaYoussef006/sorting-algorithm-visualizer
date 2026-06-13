def quick_sort(arr):
    steps = []
    n = len(arr)
    array = arr[:]
    sorted_set = set()
    stats = [0, 0]  # [comparisons, swaps]

    def snap(comp=None, swap=None, piv=-1):
        steps.append({
            'array': array[:],
            'comparing': comp or [],
            'swapping': swap or [],
            'pivot': piv,
            'sorted': list(sorted_set),
            'comparisons': stats[0],
            'swaps': stats[1]
        })

    def partition(low, high):
        pivot_idx = high
        pivot_val = array[high]
        i = low - 1

        for j in range(low, high):
            snap(comp=[j, pivot_idx], piv=pivot_idx)
            stats[0] += 1
            if array[j] <= pivot_val:
                i += 1
                if i != j:
                    array[i], array[j] = array[j], array[i]
                    stats[1] += 1
                    snap(swap=[i, j], piv=pivot_idx)

        # Place pivot in its final sorted position
        final_pos = i + 1
        array[final_pos], array[high] = array[high], array[final_pos]
        stats[1] += 1
        sorted_set.add(final_pos)
        snap(swap=[final_pos, high], piv=final_pos)
        return final_pos

    def _sort(low, high):
        if low < high:
            pi = partition(low, high)
            _sort(low, pi - 1)
            _sort(pi + 1, high)
        elif low == high:
            sorted_set.add(low)

    _sort(0, n - 1)

    for i in range(n):
        sorted_set.add(i)
    snap()

    return steps, stats[0], stats[1]
