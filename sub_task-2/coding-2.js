const processFile = require("./process_lines");

function maxProfit(prices) {
    let left = 0;
    let right = 1;
    const n = prices.length;
    let maxProfit = 0;

    while (left < n && right < n) {
        const curProfit = prices[right] - prices[left];

        if (prices[left] < prices[right]) {
            maxProfit = Math.max(maxProfit, curProfit);
        } else {
            left = right;
        }

        right++;
    }

    return maxProfit;
}

function executeCoding2(input){
    const stockPrices = input.split(",").map(a=>parseInt(a));
    const result = maxProfit(stockPrices);
    console.log("MaxProfit:",result);
}

processFile("./input-2.txt",executeCoding2)
