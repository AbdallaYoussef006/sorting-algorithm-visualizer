def insertion_sort(arr):
    steps = []
    n = len(arr)
    array = arr[:]
    sorted_set = {0}
    comparisons = 0
    swaps = 0

    for i in range(1, n):
        key = array[i]
        j = i - 1

        while j >= 0:
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
            if array[j] > key:
                array[j + 1] = array[j]
                swaps += 1
                steps.append({
                    'array': array[:],
                    'comparing': [],
                    'swapping': [j, j + 1],
                    'pivot': -1,
                    'sorted': list(sorted_set),
                    'comparisons': comparisons,
                    'swaps': swaps
                })
                j -= 1
            else:
                break

        array[j + 1] = key
        sorted_set.add(i)
        steps.append({
            'array': array[:],
            'comparing': [],
            'swapping': [],
            'pivot': -1,
            'sorted': list(sorted_set),
            'comparisons': comparisons,
            'swaps': swaps
        })

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
