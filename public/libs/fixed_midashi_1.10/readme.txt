
FixedMidashi JavaScript Library, version 1.10 (2017/10/28)

概要:
	FixedMidashi は、table の見出しを固定するための JavaScript 関数です。 
	特別なスタイルシートは必要ありません。 
	詳細は、http://hp.vector.co.jp/authors/VA056612/fixed_midashi/ を参照してください。

使用方法:
	見出しを固定したい table に _fixedhead 属性を定義し、
	FixedMidashi.create() を呼び出してください。

	以下の２つのファイルがありますが、Minified 化したファイルをお使いください。
	fixed_midashi.js:     Minified 化したファイル(35KB)
	fixed_midashi_src.js: Minified 化する前のファイル(100KB, UTF-8)

使用例:
	<script type="text/javascript" src="hoge/fixed_midashi.js"></script>

	<!-- body mode -->
	<body onLoad="FixedMidashi.create();">
	  <table _fixedhead="rows:1; cols:1">
	    ...

	<!-- div mode -->
	<style type="text/css" media="screen">
	  div.scroll_div { overflow: auto; }
	</style>
	<body onLoad="FixedMidashi.create();">
	  <div class="scroll_div">
	    ...

動作確認ブラウザ:
	以下のブラウザで動作確認しています。
		IE, Chrome, Firefox, Opera, Safari
	本プログラムは2012年に作成しており、動作確認は当時の各ブラウザの
	最新バージョンで実施しています。この時の OS は WindowsXP です。
	MAC, iOS, android などでも、いくつかのブラウザで簡単な動作確認を行っています。

アンインストール方法:
	fixed_midashi.js, fixed_midashi_src.js を削除してください。

免責事項:
	本プログラムはフリーソフトウェアです。 
	本プログラムの修正版を配布する行為は禁止します。 
	本プログラムの修正版を組み込んだソフトウェアを配布することは問題ありません。
	本プログラムの使用による、いかなる損害に対しても、作者は責任を負いません。 

作者連絡先:
	koiso@mxj.mesh.ne.jp

	このOSでこのブラウザだとこうなってしまう、
	こんなスタイルを適用するとこうなってしまう、
	といった現象がございましたら、連絡いただけるとありがたいです。

更新履歴:
	1.0 (2012/07/21) 初リリース
	1.1 (2013/05/03) ファイルを軽量化(Minified化)
	1.2 (2013/06/15) IE8かつ標準モードの場合の性能を少し改善
	1.3 (2014/06/15) モバイル対応
		モバイル端末では、ブラウザからの onScroll イベントの通知が遅く、
		スクロール時の見た目が悪かったため、PCの場合とは少し違う実装にした。
	1.4 (2014/07/05) 固定見出しの列幅の設定処理を改善
	1.5 (2014/08/12) IE8かつ標準モードの場合の性能を改善
		IE8かつ標準モードの場合に極端に遅かったがこれを改善した。
	1.6 (2014/11/23) IEの「互換表示」対応
		IEで「互換表示」させると固定見出しがずれる問題を修正した。
	1.7 (2015/01/31) body-header-id オプション追加
	1.8 (2015/05/03) body-left-header-id, div-auto-size オプション追加
		div-auto-size で div の高さの自動リサイズを抑止することにより、
		「混合モード」を実現できるようにした(スマホ用)。
	1.9 (2015/11/15)
		(1) box-shadow オプション追加
		(2) 以下の場合に正常動作していなかった不具合を修正
		・先頭行にrowSpanが2以上のセルがあるtableに対して、rows(固定する行)を0にした場合
		・対象がJavaScriptで動的に生成したtableで、tbodyがない場合
	1.10 (2017/10/18)
		(1) class オプション追加
		(2) 2017/10/28時点で最新の chrome だと見出しがずれる問題に対応

--------
Copyright (C) 2012-2017 K.Koiso

