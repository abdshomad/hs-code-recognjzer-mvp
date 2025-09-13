export const translations = {
  en: {
    // Header
    headerTitle: 'AI HS Code Predictor',
    
    // Footer
    footerText: 'Powered by Gemini API. For informational purposes only.',
    
    // ImageUploader
    uploaderTitle: 'Click to upload',
    uploaderTitleHighlight: 'or drag and drop',
    uploaderSubtitle: 'PNG, JPG, or WEBP',
    
    // App Component
    uploadedImage: 'Uploaded Image',
    predictButton: 'Predict HS Code',
    startOverButton: 'Start Over',
    tryAnotherImageButton: 'Try Another Image',
    errorTitle: 'Error',
    errorReadingFile: 'Failed to read the image file.',
    errorUnknown: 'An unknown error occurred.',
    errorRefinement: 'An unknown error occurred during refinement.',

    // Loader
    loaderAnalyzing: 'Analyzing image...',
    loaderAnalyzingSteps: [
      'Processing image data...',
      'Identifying primary subject...',
      'Extracting visual features...',
      'Cross-referencing customs database...',
      'Evaluating potential categories...',
      'Narrowing down HS codes...',
      'Finalizing top suggestions...',
    ],
    loaderRefining: 'Refining prediction...',
    loaderMoment: 'This may take a moment.',

    // ResultsDisplay
    resultsTitle: 'Initial Suggestions',
    topSuggestion: 'Top Suggestion',
    hsCodeLabel: 'HS Code',
    descriptionLabel: 'Description',
    reasoningLabel: 'Reasoning',

    // ClarificationPrompt
    clarificationTitle: 'Refine Your Prediction',

    // RefinedResultDisplay
    refinedTitle: 'Final Prediction',
    refinedSubtitle: 'Based on your selection: "{userAnswer}"',
    confirmedBadge: 'Confirmed',
  },
  id: {
    // Header
    headerTitle: 'Prediktor Kode HS AI',
    
    // Footer
    footerText: 'Didukung oleh Gemini API. Hanya untuk tujuan informasi.',
    
    // ImageUploader
    uploaderTitle: 'Klik untuk mengunggah',
    uploaderTitleHighlight: 'atau seret dan lepas',
    uploaderSubtitle: 'PNG, JPG, atau WEBP',
    
    // App Component
    uploadedImage: 'Gambar Diunggah',
    predictButton: 'Prediksi Kode HS',
    startOverButton: 'Mulai dari Awal',
    tryAnotherImageButton: 'Coba Gambar Lain',
    errorTitle: 'Kesalahan',
    errorReadingFile: 'Gagal membaca file gambar.',
    errorUnknown: 'Terjadi kesalahan yang tidak diketahui.',
    errorRefinement: 'Terjadi kesalahan yang tidak diketahui saat penyempurnaan.',

    // Loader
    loaderAnalyzing: 'Menganalisis gambar...',
    loaderAnalyzingSteps: [
      'Memproses data gambar...',
      'Mengidentifikasi subjek utama...',
      'Mengekstrak fitur visual...',
      'Memeriksa silang database bea cukai...',
      'Mengevaluasi kategori potensial...',
      'Mempersempit kode HS...',
      'Menyelesaikan saran teratas...',
    ],
    loaderRefining: 'Menyempurnakan prediksi...',
    loaderMoment: 'Ini mungkin memakan waktu sejenak.',

    // ResultsDisplay
    resultsTitle: 'Saran Awal',
    topSuggestion: 'Saran Teratas',
    hsCodeLabel: 'Kode HS',
    descriptionLabel: 'Deskripsi',
    reasoningLabel: 'Alasan',

    // ClarificationPrompt
    clarificationTitle: 'Sempurnakan Prediksi Anda',

    // RefinedResultDisplay
    refinedTitle: 'Prediksi Akhir',
    refinedSubtitle: 'Berdasarkan pilihan Anda: "{userAnswer}"',
    confirmedBadge: 'Terkonfirmasi',
  },
  ja: {
    // Header
    headerTitle: 'AI HSコード予測',
    
    // Footer
    footerText: 'Gemini APIを利用しています。情報提供のみを目的としています。',
    
    // ImageUploader
    uploaderTitle: 'クリックしてアップロード',
    uploaderTitleHighlight: 'またはドラッグ＆ドロップ',
    uploaderSubtitle: 'PNG, JPG, または WEBP',
    
    // App Component
    uploadedImage: 'アップロードされた画像',
    predictButton: 'HSコードを予測',
    startOverButton: 'やり直す',
    tryAnotherImageButton: '別の画像を試す',
    errorTitle: 'エラー',
    errorReadingFile: '画像ファイルの読み込みに失敗しました。',
    errorUnknown: '不明なエラーが発生しました。',
    errorRefinement: '絞り込み中に不明なエラーが発生しました。',

    // Loader
    loaderAnalyzing: '画像を分析中...',
    loaderAnalyzingSteps: [
      '画像データを処理中...',
      '主要な被写体を特定中...',
      '視覚的特徴を抽出中...',
      '税関データベースを相互参照中...',
      '可能性のあるカテゴリを評価中...',
      'HSコードを絞り込み中...',
      'トップ提案を最終決定中...',
    ],
    loaderRefining: '予測を絞り込み中...',
    loaderMoment: '少々お待ちください。',

    // ResultsDisplay
    resultsTitle: '最初の提案',
    topSuggestion: '最有力候補',
    hsCodeLabel: 'HSコード',
    descriptionLabel: '説明',
    reasoningLabel: '理由',

    // ClarificationPrompt
    clarificationTitle: '予測を絞り込む',

    // RefinedResultDisplay
    refinedTitle: '最終予測',
    refinedSubtitle: 'あなたの選択に基づく: "{userAnswer}"',
    confirmedBadge: '確定済み',
  }
};

export type Language = keyof typeof translations;