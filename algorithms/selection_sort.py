def selection_sort(arr):
    steps = []
    n = len(arr)
    array = arr[:]
    sorted_set = set()
    comparisons = 0
    swaps = 0

    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            # pivot highlights the current minimum candidate
            steps.append({
                'array': array[:],
                'comparing': [min_idx, j],
                'swapping': [],
                'pivot': min_idx,
                'sorted': list(sorted_set),
                'comparisons': comparisons,
                'swaps': swaps
            })
            comparisons += 1
            if array[j] < array[min_idx]:
                min_idx = j

        if min_idx != i:
            array[i], array[min_idx] = array[min_idx], array[i]
            swaps += 1
            steps.append({
                'array': array[:],
                'comparing': [],
                'swapping': [i, min_idx],
                'pivot': -1,
                'sorted': list(sorted_set),
                'comparisons': comparisons,
                'swaps': swaps
            })
        sorted_set.add(i)

    sorted_set.add(n - 1)
    steps.append({
        'array': array[:],
        'comparing': [],
        'swapping': [],
        'pivot': -1,
        'sorted': list(range(n)),
        'comparisons': comparisons,
        'swaps': swaps
    })

    return steps, comparisons, swaps
