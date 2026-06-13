def merge_sort(arr):
    steps = []
    n = len(arr)
    array = arr[:]
    sorted_set = set()
    stats = [0, 0]  # [comparisons, moves]

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

    def merge(left, mid, right):
        left_part = array[left:mid + 1]
        right_part = array[mid + 1:right + 1]
        i = j = 0
        k = left

        while i < len(left_part) and j < len(right_part):
            li = left + i
            rj = mid + 1 + j
            snap(comp=[li, rj])
            stats[0] += 1
            if left_part[i] <= right_part[j]:
                array[k] = left_part[i]
                i += 1
            else:
                array[k] = right_part[j]
                j += 1
            stats[1] += 1
            snap(swap=[k])
            k += 1

        while i < len(left_part):
            array[k] = left_part[i]
            stats[1] += 1
            snap(swap=[k])
            i += 1
            k += 1

        while j < len(right_part):
            array[k] = right_part[j]
            stats[1] += 1
            snap(swap=[k])
            j += 1
            k += 1

        for idx in range(left, right + 1):
            sorted_set.add(idx)

    def _sort(left, right):
        if left < right:
            mid = (left + right) // 2
            _sort(left, mid)
            _sort(mid + 1, right)
            merge(left, mid, right)
        elif left == right:
            sorted_set.add(left)

    _sort(0, n - 1)

    for i in range(n):
        sorted_set.add(i)
    snap()

    return steps, stats[0], stats[1]
