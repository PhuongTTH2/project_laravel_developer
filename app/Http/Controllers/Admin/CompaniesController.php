<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Company;
use App\Models\User;
use App\Mail\HelloMail;
use Illuminate\Support\Facades\Mail;
class CompaniesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $companies=[];

        $request->session()->put('keyA', 'valueA');
        return view('admin.companies.index',['companies'=>  $companies]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {

        if(!(url()->full() == url()->previous())){
            $request->session()->put('preUrl',url()->previous());
        }
        return view ('admin.companies.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try {
            DB::beginTransaction();
            $company = (!$request->company_id) ? new Company() : Company::find($request->company_id);
            $company->company_code = $request->company_code_1 . $request->company_code_2 . $request->company_code_3;
            $company->company_name = $request->company_name;
            $company->company_site_name = $request->company_site_name;
            $company->auth_type_id = $request->auth_type_id;
            $company->company_business_code = $request->company_business_code;
            $company->company_type_code = $request->company_type_code;
            $company->issuable_number_user_id = $request->issuable_number_user_id;
            $company->account_lead = $request->account_lead;
            if(isset($request->broadcaster_id)) {
                $company->broadcaster_id =  ($request->broadcaster_id == 0) ? null : $request->broadcaster_id;
            }else{
                $company->broadcaster_id = null;
            }
            $company->can_use_gyokyomaster = (boolean)$request->can_use_gyokyomaster;
            $company->save();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error($e->getMessage());
            return redirect()->back()->with('error');
        }
        return redirect()->router('admin.companies.create');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }


    public function sendMail () {
        $user = User::find(1) ;
        $mail = new HelloMail('hello');
        Mail::to('tthpspkt@gmail.com')->send($mail);
        return true;
    }
}
