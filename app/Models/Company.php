<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Company
{

    public function company_business(){
        return [];
    }
    public function company_type(){

    }
    public static function search( array $conditions, $limit = 20){
        $query = Company::with(['company_business','company_type']);
        if(isset($conditions['likes'])) {
            foreach($conditions as $like){
                $query->where($like['column'],'LIKE','%'.$like['value'].'%');
            }
        }

        return $query->paginate($limit);
    }
}
