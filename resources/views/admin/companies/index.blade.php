@extends('layouts.admin')
@section('title', '会社一覧')
@section('content')
<div class="contents_title application">
    <form action="" method="post">
      @csrf
      <h3 class="bold">会社一覧</h3>
      <a href="{{ route('company.create') }}" class="btn_S" style="position: absolute; top: 0; right: 0;">新規登録</a>
      <div class="">
        <label>会社名</label>
        <input type="text" id="company_name" name="company_name" size="30" maxlength="20" value="{{ Request()->company_name }}"/>
      </div>
      <input type="submit" id="search" name="company_search" value="この条件で検索する" class="btn_M"/>
    </form>
  </div>
@endsection
