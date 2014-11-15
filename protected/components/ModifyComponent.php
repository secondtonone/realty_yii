<?php
class ModifyComponent
{
	public $date;

	public function __construct()
	{
		$this->date=date('Y-m-d G:i:s', strtotime("+2 hours", strtotime(date('Y-m-d G:i:s'))));
	}
}