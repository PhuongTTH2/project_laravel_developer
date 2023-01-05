@extends('layouts.admin')
@section('content')
@section('title', '会社登録')
{{-- @include('common/head_meta_datapicker') --}}
<script src="/js/libs/bootstrap-notify.min.js"></script>

<div class="contents_title application">
  <form action="#" method="post">
    <h3 class="bold">会社登録</h3>
  </form>
</div>
<form action="{{ route('company.update') }}" id="formCreate" name="formCreate" method="post">
  @csrf
  <div>
    <table class="add_new_company">
      <tbody>
        <tr>
          <td class="must">
            <span>会社ID</span>
          </td>
          <td>
            <span>
              <input type="text" name="company_code_1" size="5" maxlength="5" value="{{old('company_code_1')}}">
              <input type="text" name="company_code_2" size="3" maxlength="3" value="{{old('company_code_2')}}">
              <input type="text" name="company_code_3" size="2" maxlength="2" value="{{old('company_code_3')}}">
                            <span style="display: inline-block; padding-left: 5px">※英数5文字-3文字-2文字</span>
            </span>
            <div class="err_msg">{{$errors->first('company_code')}}</div>
          </td>
        </tr>
        <tr>
          <td class="must">
            <span>会社名</span>
          </td>
          <td>
            <span>
              <input type="text" name="company_name" size="40" value="{{old('company_name')}}">
            </span>
            <div class="err_msg">{{$errors->first('company_name')}}</div>
          </td>
        </tr>
        <tr>
          <td>
            <span>部署名</span>
          </td>
          <td>
            <span>
              <input type="text" name="company_site_name" size="40" value="{{old('company_site_name')}}">
            </span>
            <div class="err_msg">{{$errors->first('company_site_name')}}</div>
          </td>
        </tr>
        <tr>
            <td class="must">
                <span>ログインID先頭文字</span>
            </td>
            <td>
                <span>
                    <input type="text" name="account_lead" size="10" value="{{ old('account_lead') }}">
                </span>
                <div class="err_msg">{{ $errors->first('account_lead') }}</div>
            </td>
        </tr>
        <tr>
          <td class="must">
            <span>役割業種</span>
          </td>
          <td>
            <label class="select_container">
            <select id="select_company_business_code" name="company_business_code" style="width: 150px; border: solid 1px #2483c5;">
              <option value="0">-</option>
              {{-- @foreach ($companyBusinessCodes as $companyBusinessCode)
                <option value="{{ $companyBusinessCode->id }}" {{old('company_business_code')== $companyBusinessCode->id  ? 'selected':''}}>{{ $companyBusinessCode->name }}</option>
              @endforeach --}}
              </select>
            </label>
            <div class="err_msg">{{$errors->first('company_business_code')}}</div>
          </td>
        </tr>

        <tr>
          <td class="must">
            <span>認証方式</span>
          </td>
          <td>
            <span>
              <input type="radio" name="auth_type_id" id="new_company_auth_1" value="1" {{old('auth_type_id','1')=='1' ? 'checked':''}}>
              <label for="new_company_auth_1">IP認証</label>
              <input type="radio" name="auth_type_id" id="new_company_auth_2" value="2" {{old('auth_type_id')=='2' ? 'checked':''}}>
              <label for="new_company_auth_2">IP認証または二段階認証</label>
            </span>
            <div class="err_msg">{{$errors->first('auth_type_id')}}</div>
          </td>
        </tr>
        <tr>
          <td colspan="2" style="text-align: left;">
            <span>アクセス元IPアドレス</span>
          </td>
        </tr>

          @if($errors->has('access_ips.*'))
          <tr>
            <td></td>
            <td>
              <div class="err_msg">{{$errors->first('access_ips.*')}}</div>
            </td>
          </tr>
          @endif

            @if(old('access_ips'))
              @foreach(old('access_ips') as $key => $access_ip)
              <tr>
                <td></td>
                <td>
                  <input type="text"  name="access_ips[]" value="{{ old('access_ips.'.$key) }}">
                  <span class="delete_ip_btn fa fa-close" onclick="formDelete(this)" style="margin-left: 4px;">
                  </span>
                </td>
              </tr>
              @endforeach
            @else
            <tr>
              <td></td>
              <td>
                <input type="text"  name="access_ips[]">
                <span class="delete_ip_btn fa fa-close" onclick="formDelete(this)"></span>
            @endif

          </td>
        </tr>
        <tr>
          <td></td>
          <td>
            <input class="btn_S" id="add_access_ip" type="button" value="+" onclick="addForm(this)">
          </td>
        </tr>
        <tr>
          <td class="must">
            <span>ユーザーID発行可能数</span>
          </td>
          <td>
            <span>
              <input type="text" name="issuable_number_user_id" value="{{old('issuable_number_user_id') ? old('issuable_number_user_id') : 10}}">
            </span>
            <div class="err_msg">{{$errors->first('issuable_number_user_id')}}</div>
          </td>
        </tr>
        <tr>
          <td>
            <span>自社マスタデータ</span>
          </td>
          <td>
            <div>
              <input type="checkbox" name="can_use_gyokyomaster" id="can_use_gyokyomaster" value="1" {{(old('can_use_gyokyomaster') == '1' or !$errors->any()) ? 'checked':'' }} />
              <label for="can_use_gyokyomaster"></label>
              <div class="err_msg">{{$errors->first('can_use_gyokyomaster')}}</div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
	<a href="{{Session('preUrl')}}" class="btn_S btn_Back" style="background-color: #ccc; margin-bottom: 30px;">戻る</a>
  <input type="submit" name="new_company_info_submit" value="登録" class="btn_M" style="margin-top: 20px; margin-bottom: 30px;">
</form>
<script type="text/javascript">
function addForm(btn) {
  var addElement = '<tr><td></td><td><input type="text" name="access_ips[]"><span class="delete_ip_btn fa fa-close" onclick="formDelete(this)" style="margin-left: 4px;"></span></td></tr>';
  var insertPoint = btn.parentNode.parentNode;
  $(addElement).insertBefore(insertPoint);
}
function formDelete(btn) {
  var record = btn.parentNode.parentNode;
  record.style.display = "none";
  record.parentNode.removeChild(record)
}
$("#select_company_business_code").change(function() {
  var val =  $(this).val();

})
</script>
@endsection
