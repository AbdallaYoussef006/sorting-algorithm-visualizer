def bubble_sort(arr):
    steps = []
    n = len(arr)
    array = arr[:]
    sorted_set = set()
    comparisons = 0
    swaps = 0

    for i in range(n - 1):
        swapped = False
        for j in range(n - 1 - i):
            steps.append({
                'array': array[:],
                'comparing': [j, j + 1],
                'swapping': [],
                'pivot': -1,
                'sorted': list(sorted_set),
                'comparisons': comparisons,
                'swaps': swaps
            })
            comparisons += 1
            if array[j] > array[j + 1]:
                array[j], array[j + 1] = array[j + 1], array[j]
                swaps += 1
                swapped = True
                steps.append({
                    'array': array[:],
                    'comparing': [],
                    'swapping': [j, j + 1],
                    'pivot': -1,
                    'sorted': list(sorted_set),
                    'comparisons': comparisons,
                    'swaps': swaps
                })
        sorted_set.add(n - 1 - i)
        if not swapped:
            for k in range(n - 1 - i):
                sorted_set.add(k)
            break

    for i in range(n):
        sorted_set.add(i)
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
