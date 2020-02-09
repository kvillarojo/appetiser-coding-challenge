<?php

namespace App\Http\Controllers;

use App\Calendar;
use Illuminate\Http\Request;

class CalendarController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
       return response()->json(Calendar::select('events')->latest('created_at')->first(), 200);
    }


    public function store(Request $request)
    {
        $calendar = Calendar::create(['events' => json_encode($request->all())]);
        return response()->json($calendar, 200);
    }

}
