const coins = [5, 10, 20, 50, 100];

// calculate the coins change for a given amount of money
export const calculateChange = (amount: number): number[] => {
    const change: number[] = [];
    let remaining = amount;
    for (let i = coins.length - 1; i >= 0; i--) {
        const coin = coins[i];
        while (remaining >= coin) {
            change.push(coin);
            remaining -= coin;
        }
    }
    return change;
};
