"use client";

import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { CheckCircle } from "iconoir-react";

export function SetPrice() {
    const [price, setPrice] = useState<string>("0");
    const [isCustom, setIsCustom] = useState(false);
    const [savedPrice, setSavedPrice] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const storedPrice = localStorage.getItem("mentionme_price");
        if (storedPrice) {
            setPrice(storedPrice);
            setSavedPrice(storedPrice);
        }
    }, []);

    const handlePreset = (value: string) => {
        setPrice(value);
        setIsCustom(false);
    };

    const handleSave = () => {
        let numPrice = parseFloat(price);
        if (isNaN(numPrice) || numPrice < 0) numPrice = 0;
        if (numPrice > 100) numPrice = 100;

        const finalPrice = numPrice.toString();
        setPrice(finalPrice);
        localStorage.setItem("mentionme_price", finalPrice);
        setSavedPrice(finalPrice);

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    // Calculate earnings (approx 90%)
    const earnings = (parseFloat(price || "0") * 0.9).toFixed(2);

    return (
        <div className="space-y-6 bg-neutral-50 min-h-screen p-4">
            {/* Header Card */}
            <div className="bg-white border border-neutral-200 p-8 rounded-2xl text-center shadow-sm">
                <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2 font-medium">Current Rate</div>
                <div className="text-6xl font-mono font-bold text-emerald-600 tracking-tighter">
                    ${savedPrice ? parseFloat(savedPrice).toFixed(2) : "0.00"}
                </div>
                <div className="text-sm text-neutral-500 mt-2">per mention</div>
            </div>

            {/* Preset Buttons */}
            <div className="grid grid-cols-2 gap-3">
                {[
                    { label: "Free", value: "0" },
                    { label: "Cheap", value: "1" },
                    { label: "Normal", value: "5" },
                    { label: "Premium", value: "10" }
                ].map((preset) => (
                    <button
                        key={preset.label}
                        onClick={() => handlePreset(preset.value)}
                        className={`
                            rounded-full border py-4 px-6 transition-all duration-200 hover:scale-105
                            ${price === preset.value && !isCustom
                                ? "bg-emerald-50 border-emerald-600 border-2 text-emerald-900"
                                : "bg-white border-neutral-200 text-neutral-900 hover:bg-neutral-50"
                            }
                        `}
                    >
                        <div className="font-mono font-semibold text-lg">{preset.label}</div>
                        <div className={`text-xs mt-1 ${price === preset.value && !isCustom ? "text-emerald-700" : "text-neutral-500"}`}>
                            ${parseFloat(preset.value).toFixed(2)}
                        </div>
                    </button>
                ))}
            </div>

            {/* Custom Input */}
            <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2 font-medium">Custom Amount</div>
                <div className="flex items-center">
                    <span className="text-neutral-400 text-2xl font-mono font-semibold mr-2">$</span>
                    <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.50"
                        value={price}
                        onChange={(e) => {
                            setPrice(e.target.value);
                            setIsCustom(true);
                        }}
                        className="border-none shadow-none text-2xl font-mono font-semibold p-0 h-auto focus-visible:ring-0 placeholder:text-neutral-300 text-neutral-900"
                        placeholder="0.00"
                    />
                </div>
            </div>

            {/* Earnings Preview */}
            <div className="text-center text-sm text-neutral-500">
                You'll earn <span className="font-mono font-medium text-emerald-600">${earnings}</span> per mention
            </div>

            {/* Save Button */}
            <Button
                onClick={handleSave}
                className="w-full !bg-emerald-600 !hover:bg-emerald-700 text-white rounded-full py-6 text-lg font-semibold shadow-sm transition-transform active:scale-[0.98]"
            >
                Save Price
            </Button>

            {/* Success Message */}
            {showSuccess && (
                <div className="fixed bottom-24 left-4 right-4 bg-neutral-900 text-white p-4 rounded-full shadow-lg flex items-center justify-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300 z-50">
                    <CheckCircle className="text-emerald-400" width={20} height={20} />
                    <span className="font-medium">Price updated successfully</span>
                </div>
            )}
        </div>
    );
}
