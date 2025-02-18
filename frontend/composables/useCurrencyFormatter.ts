export default function useCurrencyFormatter() {
    const formatCurrency = (amount: number, currency: string = "EUR", locale: string = "de-DE"): string => {
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency,
        }).format(amount);
    };

    return { formatCurrency };
}