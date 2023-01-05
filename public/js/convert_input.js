$(function(){
    $(document).on('change click blur', '.nospace', function() {
        $(this).val(del_space($(this).val()));
    });
    $(document).on('change click blur', '.trim', function() {
        $(this).val(trim($(this).val()));
    });
    $(document).on('change click blur', '.hankaku', function() {
        $(this).val(hankaku($(this).val()));
    });
    $(document).on('change click blur', '.zenkaku', function() {
        $(this).val(zenkaku($(this).val()));
    });
    $(document).on('change click blur', '.hankaku-num-only', function() {
        $(this).val(hankaku_num_only($(this).val()));
    });
    $(document).on('change click blur', '.zenkaku-num-only', function() {
        $(this).val(zenkaku_num_only($(this).val()));
    });
    $(document).on('change click blur', '.num-and-hyphen', function() {
        $(this).val(numberAndHyphen($(this).val()));
    });
    $(document).on('change click blur input', '.num-and-period', function() {
        $(this).val(numberAndPeriod($(this).val()));
    });
    $(document).on('change click blur input', '.max-price-analyze', function() {
        $(this).val(maxPriceAnalyze($(this).val()));
    });
    $(document).on('change click blur', '.zenkaku-only', function() {
        $(this).val(del_hankaku(zenkaku($(this).val())));
    });
    $(document).on('change click blur input', '.hankaku-only', function() {
        $(this).val(del_zenkaku(hankaku($(this).val())));
    });
    $(document).on('change click blur', '.hiragana', function() {
        $(this).val(conv_hiragana($(this).val()));
    });
    $(document).on('change click blur', '.katakana', function() {
        $(this).val(conv_katakana($(this).val()));
    });
    $(document).on('change click blur', '.hiragana-only', function() {
        $(this).val(only_hiragana($(this).val()));
    });
    $(document).on('change click blur', '.katakana-only', function() {
        $(this).val(only_katakana($(this).val()));
    });
    $(document).on('keydown', '.input_number_only', function(e){
        let k = e.keyCode;
        let str = String.fromCharCode(k);
        if(!(str.match(/[0-9]/) || (37 <= k && k <= 40) || k === 8 || k === 46)){
            return false;
        }
    });
    $(document).on('keyup', '.input_number_only', function(e){
        this.value = this.value.replace(/[^0-9]+/i,'');
    });
     
    $(document).on('blur', '.input_number_only',function(){
        this.value = this.value.replace(/[^0-9]+/i,'');
    });

    function aaaa(t) {
        return string.replace(/[^0-9.]/g, '')
    }

    function hankaku(t) {
        t = (t + '').replace('。', '.');
        return (t + '').replace(/[！-～]/g, function(s) {
            return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
        });
    }
    function zenkaku(t) {
        return (t + '').replace(/[!-~]/g, function(s) {
            return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
        });
    }
    function hankaku_num_only(t) {
        return t.replace(/[^0-9]/g, '');
    }
    function zenkaku_num_only(t) {
        return (zenkaku(t)).replace(/[^０-９]/g, '');
    }
    function numberAndHyphen(t) {
        return (hankaku(t)).replace(/[ー－―～＿]+/g, '-').replace(/[^0-9\-]/g, '');
    }
    function numberAndPeriod(t) {
        let str = (del_zenkaku(t)).replace(/[ー－―～＿]+/g, '.').replace(/[^0-9\.]/g, '');
        if((str.split(".").length - 1) > 1){
            str = str.slice(0,-1);
        }
        return str;
    }
    function del_hankaku(t) {
        return (t + '').replace(/[!-~\s]/g, '');
    }
    function del_zenkaku(t) {
        return (t + '').replace(/[^!-~\s]/g, '');
    }
    function trim(t) {
        return (t + '').replace(/^[\s]*/, '').replace(/[\s]*$/, '');
    }
    function del_space(t) {
        return (t + '').replace(/[\s　]+/g, '');
    }
    function only_hiragana(t) {
        t = conv_hiragana(t);
        return (t + '').replace(/[^ぁ-ん０-９ー\s]+/g, '');
    }
    function conv_hiragana(t) {
        t = zenkaku(t);
        return (t + '').replace(/[ァ-ン]/g, function(s) {
            return String.fromCharCode(s.charCodeAt(0) - 0x60);
        });
    }
    function only_katakana(t) {
        t = conv_katakana(t);
        return (t + '').replace(/[^ァ-ン０-９ー\s]+/g, '');
    }
    function conv_katakana(t) {
        t = zenkaku(t);
        return (t + '').replace(/[ぁ-ん]/g, function(s) {
            return String.fromCharCode(s.charCodeAt(0) + 0x60);
        });
    }
    function maxPriceAnalyze(t) {
        if (t.length >6) {
            t = t.slice(0,-1);
        }
        return t;
    }
});
