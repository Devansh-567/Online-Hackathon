/**
 * OCR integration stub — simulates receipt text extraction for demo.
 * Replace HTTP client with real Textract/Google Vision/etc.
 */

export async function extractReceiptText(imageBuffer, mimeType = 'image/png') {
  // Deterministic pseudo-text from buffer length (demo only)
  const seed = imageBuffer?.length || 42;
  const merchant = ['Cafe Noir', 'Metro Transit', 'Cloud SaaS Co', 'Airline X'][seed % 4];
  const amount = (seed % 200) + 10 + (seed % 100) / 100;

  return {
    rawText: `${merchant}\nTOTAL ${amount.toFixed(2)} USD\nDATE ${new Date().toISOString().slice(0, 10)}`,
    structured: {
      merchant,
      amount,
      currency: 'USD',
      confidence: 0.82 + (seed % 15) / 1000,
    },
    mimeType,
    simulated: true,
  };
}

export async function attachOcrToExpense(expense, fileMeta) {
  const fakeBuf = Buffer.from(fileMeta?.name || 'receipt', 'utf8');
  const ocr = await extractReceiptText(fakeBuf, fileMeta?.type);
  return {
    ...expense,
    ocr,
    merchant: ocr.structured.merchant,
  };
}
