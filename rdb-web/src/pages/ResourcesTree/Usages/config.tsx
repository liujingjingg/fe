export const renderContent = (value: string, row: number, index: number) => {
    if (index === 1 || index === 3) {
        return {
            children: value,
            props: {
                colSpan: 0
            }
        }
    }
    if (index === 0 || index === 2) {
        return {
            children: value,
            props: {
                rowSpan: 2
            }
        }
    }
    return value;
};