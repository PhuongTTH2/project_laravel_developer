<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class CompaniesUpdate extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    // public function authorize()
    // {
    //     return false;
    // }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $requests = FormRequest::all();
        $params = [
            'company_name' => 'required|max:32',
            'company_site_name' => 'max:64',
            'account_lead' => 'required|alpha_num|max:10',
            'auth_type_id' => 'required',
            'broadcaster_id' => '',
            'company_business_code' => 'required|not_in:0',
            'company_type_code' => 'required|not_in:0',
            'issuable_number_user_id' => 'required|integer|between:1,9999999999',
        ];
        return $params;
    }

    public function messages() {
        return [
            'company_code.size' => ':attributeは5文字-3文字-2文字で指定してください。',
            'company_business_code.not_in' => ':attribute AAAAA。',
            'company_type_code.not_in' => ':attributeは必須です。',
        ];
    }
}
