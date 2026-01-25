"use client";

import { useState } from "react";
import { pay, getPaymentStatus } from '@base-org/account';
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { CheckCircle, WarningTriangle, ArrowRight } from "iconoir-react";

interface PayResult {
    id?: string;
    transactionId?: string;
}

interface PaymentStatusResult {
    status?: string;
}

interface PaymentState {
    status: 'idle' | 'processing' | 'completed' | 'pending' | 'failed';
    message: string;
    transactionId?: string;
    timestamp?: Date;
}

export function PayMention() {
    const [recipient, setRecipient] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentState, setPaymentState] = useState<PaymentState>({ status: 'idle', message: '' });

    const storedPrice = typeof window !== 'undefined' ? localStorage.getItem("mentionme_price") : null;
    const price = storedPrice ? parseFloat(storedPrice) : 0.50;

    // Fees
    const recipientAmount = (price * 0.90).toFixed(2);
    const platformFee = (price * 0.10).toFixed(2);
    const treasuryAddress = "0x8342A48694A74044116F330db5050a267b28dD85";

    const handlePay = async () => {
        if (!recipient || !recipient.startsWith("0x")) {
            setPaymentState({
                status: 'failed',
                message: 'Please enter a valid recipient wallet address.'
            });
            return;
        }

        try {
            setIsProcessing(true);
            setPaymentState({
                status: 'processing',
                message: 'Initiating payment...',
                timestamp: new Date()
            });

            // Transaction 1: Pay Recipient
            const recipientTx = await pay({
                amount: recipientAmount,
                to: recipient,
                testnet: false
            });
            const recResult = recipientTx as PayResult;
            const recTxId = recResult?.id || recResult?.transactionId || 'unknown';

            // Transaction 2: Pay Fee
            setPaymentState({
                status: 'processing',
                message: 'Paying platform fee...'
            });

            const feeTx = await pay({
                amount: platformFee,
                to: treasuryAddress,
                testnet: false
            });
            const feeResult = feeTx as PayResult;
            const feeTxId = feeResult?.id || feeResult?.transactionId || 'unknown';

            // Monitoring
            setPaymentState({
                status: 'pending',
                message: 'Waiting for confirmation...',
                transactionId: `${recTxId}`,
                timestamp: new Date()
            });

            const checkStatus = async () => {
                try {
                    const statusResult = await getPaymentStatus({
                        id: feeTxId,
                        testnet: false
                    });

                    const statusResponse = statusResult as PaymentStatusResult;
                    const status = statusResponse?.status || 'unknown';

                    if (status === 'completed') {
                        setPaymentState({
                            status: 'completed',
                            message: `Paid $${recipientAmount} to recipient`,
                            timestamp: new Date()
                        });
                    } else if (status === 'pending') {
                        setTimeout(checkStatus, 2000);
                    } else if (status === 'failed') {
                        setPaymentState({
                            status: 'failed',
                            message: 'Fee payment failed.',
                            timestamp: new Date()
                        });
                    }
                } catch (e) {
                    console.error(e);
                }
            };

            setTimeout(checkStatus, 1000);

        } catch (error) {
            console.error("Payment error:", error);
            setPaymentState({
                status: 'failed',
                message: `Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-6 bg-neutral-50 min-h-screen p-4">
            {/* Hero Cost Display */}
            <div className="bg-white border border-neutral-200 p-10 rounded-2xl text-center shadow-sm">
                <div className="text-xs uppercase tracking-wide text-neutral-500 mb-3 font-medium">Total Cost</div>
                <div className="text-7xl font-mono font-bold text-emerald-600 tracking-tighter">
                    ${price.toFixed(2)}
                </div>
                <div className="text-sm text-neutral-500 mt-3 font-medium">Guarantees attention</div>
            </div>

            {/* Recipient Input */}
            <div>
                <div className="text-sm font-medium text-neutral-900 mb-2 ml-1">Who to mention?</div>
                <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                    <Input
                        placeholder="0x... or name.eth"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="font-mono text-lg border-none shadow-none p-0 focus-visible:ring-0 placeholder:text-neutral-300 text-neutral-900"
                    />
                </div>
                <div className="text-xs text-neutral-500 mt-2 ml-1">Money goes instantly to their Base wallet</div>
            </div>

            {/* Fee Breakdown */}
            <div className="bg-neutral-50 border border-neutral-200 p-5 rounded-xl space-y-3">
                <div className="flex justify-between items-center border-b border-neutral-200 pb-3">
                    <span className="text-sm text-neutral-500 font-medium">To Recipient</span>
                    <span className="font-mono text-lg font-bold text-emerald-600">${recipientAmount}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                    <span className="text-sm text-neutral-500 flex items-center gap-1">
                        Platform Fee
                        <span className="text-[10px] bg-neutral-200 text-neutral-600 px-1.5 py-0.5 rounded-full font-medium">10%</span>
                    </span>
                    <span className="font-mono text-sm text-neutral-500">${platformFee}</span>
                </div>
            </div>

            {/* Pay Button */}
            <div className={isProcessing ? 'opacity-50 pointer-events-none' : ''}>
                <Button
                    onClick={handlePay}
                    className="w-full !bg-emerald-600 !hover:bg-emerald-700 text-white rounded-full py-6 text-lg font-semibold shadow-sm transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    {isProcessing ? 'Processing...' : 'Pay & Mention'}
                    {!isProcessing && <ArrowRight width={20} height={20} />}
                </Button>
            </div>

            {/* Status Messages */}
            {paymentState.status === 'failed' && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3 border border-red-100">
                    <WarningTriangle className="shrink-0 mt-0.5" />
                    <div className="text-sm font-medium">{paymentState.message}</div>
                </div>
            )}

            {paymentState.status === 'completed' && (
                <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-start gap-3 border border-emerald-100 animate-in fade-in slide-in-from-bottom">
                    <CheckCircle className="shrink-0 mt-0.5" />
                    <div>
                        <div className="font-semibold mb-1">Payment Sent!</div>
                        <div className="text-sm opacity-90">{paymentState.message}</div>
                    </div>
                </div>
            )}

            {paymentState.status === 'pending' && (
                <div className="text-center text-sm font-medium text-neutral-500 animate-pulse bg-neutral-100 p-3 rounded-lg">
                    Confirming transaction on chain...
                </div>
            )}
        </div>
    );
}
